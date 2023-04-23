import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import {
    loadContacts,
    saveContacts,
    formatContactsList,
    generateNewContactId,
} from './services.js';

const rl = readline.createInterface({ input, output });

const contactsList = [];

console.log('--- ContactsList ---');

async function createNewContact() {
    const firstName = await rl.question('First Name: ');
    const lastName = await rl.question('Last Name: ');

    const id = generateNewContactId(contactsList);

    const newContact = {
        id,
        firstName,
        lastName,
    };

    contactsList.push(newContact);
    saveContacts(contactsList);
}

async function deleteContact() {
    if (contactsList.length < 1) {
        console.error('There is no contact on the list');
        return;
    }

    showContactsList();

    const contactId = await rl.question('Delete ID: ');
    const contactIndex = contactsList.findIndex(({ id }) => id === Number(contactId));

    if (contactIndex < 0) {
        console.error('Invalid ID');
        return;
    }

    contactsList.splice(contactIndex, 1);
    saveContacts(contactsList);
}

function showContactsList() {
    const formattedContactsList = formatContactsList(contactsList);
    
    console.log('Contacts List:');
    console.log(formattedContactsList);
}

function quit() {
    rl.close();
}

async function help() {
    console.log('n: add new contact\nd: delete a contact\nl: show contacts list\nq: quit');
    console.log('----------');

    const action = await rl.question('Enter your input: ');

    if (action === 'n') {
        await createNewContact();
    } else if (action === 'd') {
        await deleteContact();
    } else if (action === 'l') {
        showContactsList();
    } else {
        quit();
        return;
    }

    console.log('----------');

    help();
}

async function main() {
    const loadedContacts = await loadContacts();

    contactsList.push(...loadedContacts);
    help();
}

await main();
