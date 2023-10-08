import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import sql from './db.js';

await sql`CREATE TABLE IF NOT EXISTS customers (id SERIAL, fullname TEXT, address TEXT)`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`${process.env.NAME} service v${process.env.VERSION}`);
});

app.get('/customers', async (req, res) => {
    const customers = await sql`SELECT * FROM customers`;

    res.json(customers);
});

app.get('/customer/:id', async (req, res) => {
    const [customer] = await sql`SELECT * FROM customers WHERE id = ${req.params.id}`;

    res.json(customer);
});

app.post('/customer', async (req, res) => {
    const { fullname, address } = req.body;

    const [customer] = await sql`INSERT INTO customers(fullname, address) VALUES(${fullname}, ${address}) RETURNING *`;

    res.json(customer);
});

app.delete('/customer/:id', async (req, res) => {
    await sql`DELETE FROM customers WHERE id = ${req.params.id}`;

    res.send(`Customer #${req.params.id} has been deleted!`);
});

app.listen(process.env.PORT, () => {
    console.log(process.env.NAME, 'service is running on port', process.env.PORT);
});
