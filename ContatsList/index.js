import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const contactsList = [];

console.log('--- ContactsList ---');

const firstName = await rl.question('First Name: ');
const lastName = await rl.question('Last Name: ');

const newContact = {
    id: contactsList.length,
    firstName,
    lastName,
};

contactsList.push(newContact);

const formattedContactsList = contactsList
    .map(({ id, firstName, lastName }) => `#${id} ${firstName} ${lastName}`)
    .join('\n');

console.log('Contacts List:');
console.log(formattedContactsList);

rl.close();
