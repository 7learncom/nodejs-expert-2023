import express from 'express';
import { formatContactsList } from '../services.js';
import { Contact } from '../models/index.js';

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const contacts = await Contact.findAll();

        if (req.query.format) {
            const responseData = `<pre>${formatContactsList(contacts)}</pre>`;

            res.type('html');
            res.send(responseData);
            return;
        }

        res.json(contacts);
    } catch(error) {
        res.status(500).send({
            message: 'Something went wrong',
            error,
        });
    }
});

router.post('/new', async (req, res) => {
    const { firstName, lastName, mobilePhone, isFavorite } = req.body;

    try {
        const { id } = await Contact.create({
            firstName,
            lastName,
            mobilePhone,
            isFavorite,
        });

        res.send(`The contact "#${id} ${firstName} ${lastName}" has been created!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Contact.destroy({
            where: { id: req.params.id },
        });

        res.send(`Contact #${req.params.id} has been deleted!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, mobilePhone, isFavorite } = req.body;

        await Contact.update({
            firstName,
            lastName,
            mobilePhone,
            isFavorite,
        }, {
            where: { id: req.params.id },
        });

        res.send(`Contact #${req.params.id} has been modified!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
});

export default router;
