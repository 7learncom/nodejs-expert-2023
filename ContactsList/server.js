import http from 'http';
import url from 'url';

import { formatContactsList, loadContacts } from './services.js';

const contactsList = [];

const server = http.createServer((req, res) => {
    const urlData = url.parse(req.url, true);

    console.log(req.method, req.url);

    let responseData = null;

    if (urlData.query.format == 'true') {
        res.setHeader('Content-Type', 'text/html');

        responseData = '<pre>';
        responseData += formatContactsList(contactsList);
        responseData += '</pre>';
    } else {
        res.setHeader('Content-Type', 'application/json');
        responseData = JSON.stringify(contactsList);
    }

    res.writeHead(200);
    res.write(responseData);

    res.end();
});

async function main() {
    const loadedContacts = await loadContacts();

    contactsList.push(...loadedContacts);
    server.listen(3000, () => {
        console.log('HTTP server is listening on the port 3000');
    });
}

await main();