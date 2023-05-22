import multer from 'multer';
import { Contact } from '../../models/index.js';
import { formatContactsList } from '../../utils.js';

const upload = multer({ storage: multer.memoryStorage() });

async function loadContacts(req, res, next) {
    try {
        const {
            sort,
            desc,
        } = req.query;

        const order = [];

        if (sort) {
            order.push(
                [sort,  desc === 'true' ? 'DESC' : 'ASC'],
            );
        }

        const contacts = await Contact.findAll({
            order,
        });

        req.locals = {
            contacts,
        };

        next();
    } catch(error) {
        res.status(500).send({
            message: 'Something went wrong',
            error,
        });
    }
}

async function getContactsFormatted(req, res, next) {
    if (req.query.format !== 'true') {
        return next();
    }

    const { contacts } = req.locals;
    const responseData = `<pre>${formatContactsList(contacts)}</pre>`;

    res.type('html');
    res.send(responseData);
}

async function getContactsJSON(req, res) {
    const { contacts } = req.locals;
    const normalizedeContacts = contacts.map(({ dataValues: { id, profilePicture, ...rest } }) => ({
        id,
        profilePicture: profilePicture ? `/images/profile-picture/${id}` : null,
        ...rest
    }));

    res.json(normalizedeContacts);
}

export const getContacts = [
    loadContacts,
    getContactsFormatted,
    getContactsJSON,
];

export async function getContactProfilePicture(req, res) {
    try {
        const { profilePicture } = await Contact.findOne({
            attributes: ['profilePicture'],
            where: { id: req.params.id },
        });

        res.type('image/jpeg');
        res.send(profilePicture);
    } catch(error) {
        res.status(500).send({
            message: 'Something went wrong',
            error,
        });
    }
}

async function createContactCtl(req, res) {
    const { firstName, lastName, mobilePhone, isFavorite } = req.body;
    const { buffer: profilePicture } = req.file || {};

    try {
        const { id } = await Contact.create({
            firstName,
            lastName,
            mobilePhone,
            isFavorite,
            profilePicture,
        });

        res.send(`The contact "#${id} ${firstName} ${lastName}" has been created!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
}

export const createContact = [
    upload.single('profilePicture'),
    createContactCtl,
];

export async function deleteContact(req, res) {
    try {
        await Contact.destroy({
            where: { id: req.params.id },
        });

        res.send(`Contact #${req.params.id} has been deleted!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
}

export async function updateContact(req, res) {
    try {
        const { firstName, lastName, mobilePhone, isFavorite } = req.body;

        await Contact.update({
            firstName,
            lastName,
            mobilePhone,
            isFavorite,
        }, {
            where: { id: req.params.id },
        });

        res.send(`Contact #${req.params.id} has been modified!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
}
