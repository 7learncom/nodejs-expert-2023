import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { formatContactsList } from './services.js';
import { sequelize, Contact } from './models/index.js';

const rl = readline.createInterface({ input, output });

async function createNewContact() {
    const firstName = await rl.question('First Name: ');
    const lastName = await rl.question('Last Name: ');
    const mobilePhone = await rl.question('Phone (Mobile): ');
    const isFavorite = await rl.question('Is Favorite (Default: No): ');

    await Contact.create({
        firstName,
        lastName,
        mobilePhone,
        isFavorite: ['yes', 'Yes', 'YES'].includes(isFavorite),
    });
}

async function deleteContact() {
    await showContactsList();

    const id = await rl.question('Delete ID: ');

    await Contact.destroy({
        where: { id },
    });
}

async function showContactsList() {
    const contacts = await Contact.findAll();

    const formattedContactsList = formatContactsList(contacts);

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
        await showContactsList();
    } else {
        quit();
        return;
    }

    console.log('----------');

    help();
}

async function main() {
    console.log('--- ContactsList ---');

    try {
        await sequelize.sync({ force: false });
        console.log('[All models were synchronized successfully]');

        help();
    } catch(error) {
        console.log('Error in syncing models:', error);
    }
}

await main();
