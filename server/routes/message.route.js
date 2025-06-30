import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { deleteForEveryone, deleteForMe, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router()

router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);
router.post("/delete/:id/for-me", isAuthenticated, deleteForMe);
router.post("/delete/:id/for-everyone", isAuthenticated, deleteForEveryone);
export default router