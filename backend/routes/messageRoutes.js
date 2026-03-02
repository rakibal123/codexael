import express from 'express';
const router = express.Router();
import {
    sendMessage,
    getMessages,
} from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(sendMessage)
    .get(protect, admin, getMessages);

export default router;
