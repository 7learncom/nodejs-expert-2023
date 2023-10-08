import express from 'express';
import bodyParser from 'body-parser';
import amqp from 'amqplib';
import 'dotenv/config';
import sql from './db.js';
import { createPayment } from './GRPCCalls.js';

const STATUS = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    FAILED: 3,
    CANCELED: 4,
};

const CatalogsService = process.env.CATALOGS_SERVICE;
const CustomerService = process.env.CUSTOMER_SERVICE;

const connection = await amqp.connect(process.env.AMQP_SERVER);
const channel = await connection.createChannel();
channel.assertQueue(process.env.ORDERS_QUEUE, {
    durable: false
});

function publishToQueue(order) {
    const message = Buffer.from(
        JSON.stringify(order)
    );

    channel.sendToQueue(process.env.ORDERS_QUEUE, message);
}

await sql`CREATE TABLE IF NOT EXISTS orders (id SERIAL, customer_id INTEGER, product_id INTEGER, payment_id INTEGER, status INTEGER)`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`${process.env.NAME} service v${process.env.VERSION}`);
});

app.get('/orders', async (req, res) => {
    const orders = await sql`SELECT * FROM orders`;

    res.json(orders);
});

app.post('/orders', async (req, res) => {
    const { customer_id, product_id } = req.body;

    const customerRes = await fetch(`${CustomerService}/customer/${customer_id}`);
    const customer = await customerRes.json().catch(() => null);

    if (!customer) {
        res.status(400).send('Invalid customer id!');
        return;
    }

    const orderedProductRes = await fetch(`${CatalogsService}/product/${product_id}/order`, {
        method: 'PATCH',
    });

    if (orderedProductRes.status !== 200) {
        res.status(orderedProductRes.status).send(await orderedProductRes.text());
        return;
    }

    const orderedProduct = await orderedProductRes.json();

    try {
        const payment = await createPayment({
            customer_id: customer.id,
            amount: orderedProduct.price,
        });

        const [order] = await sql`INSERT INTO orders
            (customer_id, product_id, payment_id, status) VALUES
            (${customer.id}, ${orderedProduct.id}, ${payment.getId()}, ${STATUS.PENDING}) RETURNING *`;

        res.json(order);

        publishToQueue(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch('/order/:id', async (req, res) => {
    const { status } = req.body;

    const [order] = await sql`SELECT * FROM orders WHERE id = ${req.params.id}`;

    if (order.status !== Number(status) && Number(status) === STATUS.CANCELED) {
        await fetch(`${CatalogsService}/product/${order.product_id}/restore`, {
            method: 'PATCH',
        });
    }

    order.status = status;

    await sql`UPDATE orders SET ${sql(order, 'status')} WHERE id = ${order.id}`;

    res.send(`Order #${order.id} has been updated!`);
});

app.listen(process.env.PORT, () => {
    console.log('Orders service is running on port', process.env.PORT);
});
