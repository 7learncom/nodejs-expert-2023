import multer from 'multer';
import { Sequelize } from 'sequelize';
import passport from 'passport';
import { Contact } from '../../models/index.js';
import { formatContactsList } from '../../utils.js';

const CONTACTS_LIST_PAGE_SIZE = 20;

const upload = multer({ storage: multer.memoryStorage() });

async function loadContacts(req, res, next) {
    const {
        sort,
        desc,
        q,
        page = 1,
    } = req.query;

    const where = { UserId: req.user.id };
    const order = [];

    if (q) {
        where[Sequelize.Op.or] = [
            { firstName: { [Sequelize.Op.like]: `%${q}%` } },
            { lastName: { [Sequelize.Op.like]: `%${q}%` } },
            { mobilePhone: { [Sequelize.Op.like]: `%${q}%` } },
        ];
    }

    if (sort) {
        order.push(
            [sort,  desc === 'true' ? 'DESC' : 'ASC'],
        );
    }

    try {
        const contacts = await Contact.findAll({
            where,
            order,
            limit: CONTACTS_LIST_PAGE_SIZE,
            offset: Math.max(0, (page - 1) * CONTACTS_LIST_PAGE_SIZE),
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

function getContactsFormatted(req, res, next) {
    if (req.query.format !== 'true') {
        return next();
    }

    const { contacts } = req.locals;
    const responseData = `<pre>${formatContactsList(contacts)}</pre>`;

    res.type('html');
    res.send(responseData);
}

function getContactsJSON(req, res) {
    const { contacts } = req.locals;
    const normalizedeContacts = contacts.map(({ dataValues: { id, profilePicture, ...rest } }) => ({
        id,
        profilePicture: profilePicture ? `/images/profile-picture/${id}` : null,
        ...rest
    }));

    res.json(normalizedeContacts);
}

export const getContacts = [
    passport.authenticate('jwt', { session: false }),
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
            UserId: req.user.id,
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
    passport.authenticate('jwt', { session: false }),
    upload.single('profilePicture'),
    createContactCtl,
];

async function deleteContactCtl(req, res) {
    try {
        const deletedContact = await Contact.destroy({
            where: { id: req.params.id, UserId: req.user.id },
        });

        if (!deletedContact) {
            res.send(`Contact not found!`);
            return;
        }

        res.send(`Contact #${req.params.id} has been deleted!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
}

export const deleteContact = [
    passport.authenticate('jwt', { session: false }),
    deleteContactCtl,
];

async function updateContactCtl(req, res) {
    try {
        const { firstName, lastName, mobilePhone, isFavorite } = req.body;

        const updatedContact = await Contact.update({
            firstName,
            lastName,
            mobilePhone,
            isFavorite,
        }, {
            where: { id: req.params.id, UserId: req.user.id },
        });

        if (!updatedContact) {
            res.send(`Contact not found!`);
            return;
        }

        res.send(`Contact #${req.params.id} has been modified!`);
    } catch(error) {
        res.status(400).send({
            message: 'Something went wrong',
            error,
        });
    }
}

export const updateContact = [
    passport.authenticate('jwt', { session: false }),
    updateContactCtl,
];
