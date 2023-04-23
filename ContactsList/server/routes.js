import express from 'express';
import { formatContactsList, loadContacts } from '../services.js';

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

const loadedContacts = await loadContacts();
contactsList.push(...loadedContacts);

export default router;
