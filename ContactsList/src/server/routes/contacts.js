import express from 'express';
import {
    getContacts,
    createContact,
    deleteContact,
    updateContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/list', getContacts);
router.post('/new', createContact);
router.delete('/:id', deleteContact);
router.put('/:id', updateContact);

export default router;
