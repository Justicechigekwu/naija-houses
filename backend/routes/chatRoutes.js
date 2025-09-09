import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { getChats, getmessages, sendmessage, startChat } from '../controller/chatController.js';

const router = express.Router();

router.post('/start', verifyToken, startChat)
router.get('/', verifyToken, getChats)
router.get('/:chatId/messages', verifyToken, getmessages)
router.post('/message', verifyToken, sendmessage)

export default router;