// src/routes/chatRoutes.js

import express from "express";
import chatController from "../controllers/chatController.js";
const router = express.Router();

// ===============================
// CHAT ROUTES
// ===============================

// ✅ Send message to AI
router.post("/message", chatController.sendMessage);

// ✅ Get full chat history (all sessions)
router.get("/history/:userId", chatController.getHistory);

// ✅ Get specific session history
router.get("/history/:userId/session/:sessionId", chatController.getHistory);

// ✅ Delete a chat session
router.delete("/session/:userId/:sessionId", chatController.deleteSession);

export default router;