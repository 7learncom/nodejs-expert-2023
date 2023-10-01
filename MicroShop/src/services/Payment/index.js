import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import sql from './db.js';

const STATUS = {
    PENDING: 0,
    PAID: 1,
    FAILED: 2,
};

await sql`CREATE TABLE IF NOT EXISTS payment (id SERIAL, customer_id INTEGER, amount INTEGER, status INTEGER)`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

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

app.listen(process.env.PORT, () => {
    console.log('Payment service is running on port', process.env.PORT);
});
