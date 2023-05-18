import fs from 'fs/promises';

const CONTACTS_LIST_FILE_PATH = './data/contacts-list.json';

export async function loadContacts() {
    try {
        const contactsListJSON = await fs.readFile(CONTACTS_LIST_FILE_PATH, 'utf-8');
        return JSON.parse(contactsListJSON);
    } catch(error) {
        throw error;
    }
}

export async function saveContacts(contactsList) {
    try {
        const contactsListJSON = JSON.stringify(contactsList);
        await fs.writeFile(CONTACTS_LIST_FILE_PATH, contactsListJSON);
    } catch(error) {
        throw error;
    }
}

export function formatContactsList(contactsList) {
    return contactsList
        .map(({ id, firstName, lastName, isFavorite, mobilePhone }) => (
            `#${id} (${isFavorite ? '*' : '-'}) ${firstName} ${lastName} (${mobilePhone || 'NONE'})`
        ))
        .join('\n');
}

export function generateNewContactId(contactsList) {
    const lastContact = contactsList[contactsList.length - 1];
    const id = lastContact ? lastContact.id + 1 : 0;

    return id;
}
