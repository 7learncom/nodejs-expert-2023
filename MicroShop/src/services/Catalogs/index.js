import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import sql from './db.js';

await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL, name TEXT, price INTEGER, quantity INTEGER)`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/products', async (req, res) => {
    const products = await sql`SELECT * FROM products`;

    res.json(products);
});

app.post('/product', async (req, res) => {
    const { name, price, quantity } = req.body;

    const product = await sql`INSERT INTO products(name, price, quantity) VALUES(${name}, ${price}, ${quantity}) RETURNING *`;

    res.json(product);
});

app.patch('/product/:id', async (req, res) => {
    const { quantity } = req.body;
    const product = {
        id: req.params.id,
        quantity,
    };

    await sql`UPDATE products set ${sql(product, 'quantity')} WHERE id = ${product.id}`;

    res.send(`Product #${product.id} has been updated!`);
});

app.delete('/product/:id', async (req, res) => {
    await sql`DELETE FROM products WHERE id = ${req.params.id}`;

    res.send(`Product #${req.params.id} has been deleted!`);
});

app.listen(process.env.PORT, () => {
    console.log('Catalogs service is running on port', process.env.PORT);
});
