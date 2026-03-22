import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  deleteChat,
  getChatById,
  getChats,
  getmessages,
  markChatAsSeen,
  sendmessage,
  startChat,
} from "../controller/chatController.js";

const router = express.Router();

router.post("/start", verifyToken, startChat);
router.get("/", verifyToken, getChats);
router.get("/:chatId/messages", verifyToken, getmessages);
router.get("/:chatId", verifyToken, getChatById);
router.post("/message", verifyToken, sendmessage);
router.patch("/:chatId/seen", verifyToken, markChatAsSeen);
router.delete("/:chatId", verifyToken, deleteChat);

export default router;