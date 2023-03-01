import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const contactsList = [];

console.log('--- ContactsList ---');

async function addNewContact() {
    const firstName = await rl.question('First Name: ');
    const lastName = await rl.question('Last Name: ');
    
    const newContact = {
        id: contactsList.length,
        firstName,
        lastName,
    };
    
    contactsList.push(newContact);
}

function showContactsList() {
    const formattedContactsList = contactsList
        .map(({ id, firstName, lastName }) => `#${id} ${firstName} ${lastName}`)
        .join('\n');
    
    console.log('Contacts List:');
    console.log(formattedContactsList);
}

function quit() {
    rl.close();
}

async function help() {
    console.log('n: Add new contact\nl: show contacts list\nq: quit');
    const action = await rl.question('Enter your input: ');

    if (action === 'n') {
        await addNewContact();
    } else if (action === 'l') {
        showContactsList();
    } else {
        quit();
        return;
    }

    help();
}

help();
