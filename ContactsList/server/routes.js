import express from 'express';
import {
    loadContacts,
    saveContacts,
    formatContactsList,
    generateNewContactId,
} from '../services.js';

const contactsList = [];

const router = express.Router();

router.get('/list', (req, res) => {
    if (req.query.format) {
        const responseData = `<pre>${formatContactsList(contactsList)}</pre>`;

        res.type('html');
        res.send(responseData);
        return;
    }

    res.json(contactsList);
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

const loadedContacts = await loadContacts();
contactsList.push(...loadedContacts);

export default router;
