import express from 'express';
import {
    loadContacts,
    saveContacts,
    formatContactsList,
    generateNewContactId,
} from '../services.js';
import { query } from '../db.js';

const contactsList = [];

const router = express.Router();

router.get('/list', async (req, res) => {
    const contactsListDB = await query('SELECT * FROM contacts');

    if (req.query.format) {
        const responseData = `<pre>${formatContactsList(contactsListDB.rows)}</pre>`;

        res.type('html');
        res.send(responseData);
        return;
    }

    res.json(contactsListDB.rows);
});

router.post('/new', (req, res) => {
    const { firstName, lastName } = req.body;

    const id = generateNewContactId(contactsList);

    const newContact = {
        id,
        firstName,
        lastName,
    };

    contactsList.push(newContact);
    saveContacts(contactsList);

    res.send(`The contact "#${id} ${firstName} ${lastName}" has been created!`);
});

router.delete('/:id', (req, res) => {
    if (contactsList.length < 1) {
        res.status(400).send({
            message: 'There is no contact on the list',
        });

        return;
    }

    const contactIndex = contactsList.findIndex(({ id }) => id === Number(req.params.id));

    if (contactIndex < 0) {
        res.status(400).send({
            message: 'Invalid ID',
        });

        return;
    }

    contactsList.splice(contactIndex, 1);
    saveContacts(contactsList);

    res.send(`Contact #${req.params.id} has been deleted!`);
});

router.put('/:id', (req, res) => {
    if (contactsList.length < 1) {
        res.status(400).send({
            message: 'There is no contact on the list',
        });

        return;
    }

    const contactIndex = contactsList.findIndex(({ id }) => id === Number(req.params.id));

    if (contactIndex < 0) {
        res.status(400).send({
            message: 'Invalid ID',
        });

        return;
    }

    const { firstName, lastName } = req.body;
    const contact = contactsList[contactIndex];
    const updatedContact = {
        ...contact,
        firstName: firstName || contact.firstName,
        lastName: lastName || contact.lastName,
    };

    contactsList.splice(contactIndex, 1, updatedContact);
    saveContacts(contactsList);

    res.send(`Contact #${req.params.id} has been modified!`);
});

const loadedContacts = await loadContacts();
contactsList.push(...loadedContacts);

export default router;
