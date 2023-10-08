import express from 'express';
import bodyParser from 'body-parser';
import { STATUS } from './constants.js';
import sql from './db.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`${process.env.NAME} service v${process.env.VERSION}`);
});

app.get('/payment', async (req, res) => {
    const payment = await sql`SELECT * FROM payment`;

    res.json(payment);
});

app.post('/payment', async (req, res) => {
    const { customer_id, amount } = req.body;

    const [payment] = await sql`INSERT INTO payment(customer_id, amount, status) VALUES(${customer_id}, ${amount}, ${STATUS.PENDING}) RETURNING *`;

    res.json(payment);
});

app.patch('/payment/:id', async (req, res) => {
    const { status } = req.body;
    const payment = {
        id: req.params.id,
        status,
    };

    await sql`UPDATE payment SET ${sql(payment, 'status')} WHERE id = ${payment.id}`;

    res.send(`Payment #${payment.id} has been updated!`);
});

export default function startServer(port) {
    app.listen(port, () => {
        console.log('Payment REST server is running on port', port);
    });
}
