import express from 'express';
import amqp from 'amqplib';
import 'dotenv/config';

const NOTIFICATIONS = [];

const connection = await amqp.connect(process.env.AMQP_SERVER);
const channel = await connection.createChannel();
channel.assertQueue(process.env.ORDERS_QUEUE, {
    durable: false,
});

channel.consume(process.env.ORDERS_QUEUE, (message) => {
    const order = JSON.parse(
        message.content.toString()
    );

    const notification = {
        id: NOTIFICATIONS.length,
        order,
    };

    NOTIFICATIONS.push(notification);
});

const app = express();

app.get('/', (req, res) => {
    res.send(`${process.env.NAME} service v${process.env.VERSION}`);
});

app.get('/notifications', (req, res) => {
    res.json(
        NOTIFICATIONS,
    );
});

app.listen(process.env.PORT, () => {
    console.log('Notifications service is running on port', process.env.PORT);
});
