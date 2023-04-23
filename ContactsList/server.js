import express from 'express';

import { formatContactsList, loadContacts } from './services.js';

const app = express();

const contactsList = [];

function loggerMiddleware(req, res, next) {
    console.log('Request:', req.method, req.url);
    next();
}

app.disable('etag');
app.use(loggerMiddleware);

app.get('/list', (req, res) => {
    if (req.query.format) {
        const responseData = `<pre>${formatContactsList(contactsList)}</pre>`;

        res.type('html');
        res.send(responseData);
        return;
    }

    res.json(contactsList);
});

async function main() {
    const loadedContacts = await loadContacts();

    contactsList.push(...loadedContacts);
    app.listen(3000, () => {
        console.log('express server is listening on the port 3000');
    });
}

await main();