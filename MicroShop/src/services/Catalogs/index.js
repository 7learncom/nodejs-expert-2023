import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import sql from './db.js';

await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL, name TEXT, price INTEGER, quantity INTEGER)`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`${process.env.NAME} service v${process.env.VERSION}`);
});

app.get('/products', async (req, res) => {
    const products = await sql`SELECT * FROM products`;

    res.json(products);
});

app.post('/product', async (req, res) => {
    const { name, price, quantity } = req.body;

    const [product] = await sql`INSERT INTO products(name, price, quantity) VALUES(${name}, ${price}, ${quantity}) RETURNING *`;

    res.json(product);
});

app.patch('/product/:id', async (req, res) => {
    const { quantity } = req.body;
    const product = {
        id: req.params.id,
        quantity,
    };

    await sql`UPDATE products SET ${sql(product, 'quantity')} WHERE id = ${product.id}`;

    res.send(`Product #${product.id} has been updated!`);
});

app.patch('/product/:id/order', async (req, res) => {
    await sql.begin(async sql => {
        const [product] = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;

        if (!product) {
            throw new Error(`Invalid product id!`);
        }

        if (product.quantity < 1) {
            throw new Error(`Not enough ${product.name} in the store!`);
        }

        product.quantity -= 1;

        await sql`UPDATE products SET ${sql(product, 'quantity')} WHERE id = ${product.id}`;

        return product;
    })
    .then((product) => {
        res.json(product);
    })
    .catch((error) => {
        res.status(400).send(error.message);
    });
});

app.patch('/product/:id/restore', async (req, res) => {
    const [product] = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;

    product.quantity += 1;

    await sql`UPDATE products SET ${sql(product, 'quantity')} WHERE id = ${product.id}`;

    res.send(`Product #${product.id} has been restored!`);
});

app.delete('/product/:id', async (req, res) => {
    await sql`DELETE FROM products WHERE id = ${req.params.id}`;

    res.send(`Product #${req.params.id} has been deleted!`);
});

app.listen(process.env.PORT, () => {
    console.log('Catalogs service is running on port', process.env.PORT);
});
