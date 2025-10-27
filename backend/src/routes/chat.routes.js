// src/routes/chat.routes.js
import express from "express";
import { sendMessage, getMessages } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"; // default export

const router = express.Router();

// Get all messages for a workspace (protected)
router.get("/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const messages = await getMessages(workspaceId);
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// Send a new message (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const io = req.app.get("io"); // get Socket.IO instance
    const { workspaceId, senderId, text } = req.body;

    if (!workspaceId || !senderId || !text) {
      return res.status(400).json({ success: false, message: "workspaceId, senderId, and text are required" });
    }

    // Broadcast and save the message
    await sendMessage(io, { workspaceId, senderId, text });

    res.json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

export default router;
