import express from 'express';
import { getContactProfilePicture } from '../controllers/contacts.js';

const router = express.Router();

router.get('/profile-picture/:id', getContactProfilePicture);

export default router;
