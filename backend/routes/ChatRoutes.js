import express from "express";
import { auth, requireAuth } from "../middleware/auth.js";
import {
  getConversation,
  getMessages,
  sendMessage
} from "../controllers/ChatController.js";

const router = express.Router();

router.use(auth);
router.use(requireAuth);

// Parent & Counsellor only
router.get("/conversation/:childId", getConversation);
router.get("/messages/:conversationId", getMessages);
router.post("/messages/:conversationId", sendMessage);

export default router;
