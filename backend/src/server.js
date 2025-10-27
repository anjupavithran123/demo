// src/server.js
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import express from "express";
import app from "./App.js"; // your Express app
import * as chatController from "./controllers/chat.controller.js"; // import all to be safe

dotenv.config();

// Validate required env early (helpful on Render)
if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI environment variable!");
}

// Connect to MongoDB (log errors, don't silently swallow)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error("DB connection error:", err);
    // exit so Render shows failure; remove process.exit in dev if desired
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.IO server
const CLIENT_URL = process.env.CLIENT_URL || "*"; // set CLIENT_URL on Render to tighten CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in routes/controllers if needed
app.set("io", io);

// Serve uploads (avatars) if directory exists
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Helpful 404 logger for debugging on Render (optional, but useful)
app.use((req, res, next) => {
  // If a response has already been sent (route matched), skip.
  if (res.headersSent) return next();
  // Let normal routes run first; only run at the end if nothing matched.
  next();
});
app.use((req, res, next) => {
  // This is only reached if no route matched earlier.
  if (res.headersSent) return next();
  console.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Not found" });
});

// Socket event wiring ------------------------------------------------------
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Client should emit: socket.emit("joinWorkspace", { workspaceId })
  socket.on("joinWorkspace", async ({ workspaceId }) => {
    if (!workspaceId) return;
    socket.join(workspaceId);
    console.log(`${socket.id} joined workspace ${workspaceId}`);

    try {
      // call controller's getMessages (guarded)
      const getMessages = chatController.getMessages || chatController.default?.getMessages;
      if (!getMessages) {
        console.warn("getMessages not found in chat.controller");
        return socket.emit("error", { message: "Server missing getMessages" });
      }

      const pastMessages = await getMessages(workspaceId);
      socket.emit("getMessages", pastMessages);
    } catch (err) {
      console.error("getMessages error:", err);
      socket.emit("error", { message: "Failed to load messages" });
    }
  });

  // Client sends chat messages with event "chatMessage"
  // payload: { workspaceId, senderId, text }
  socket.on("chatMessage", async (payload) => {
    try {
      // Support different export names: prefer sendMessage, fallback to handleChatMessage
      const sendMessage =
        chatController.sendMessage || chatController.handleChatMessage || chatController.default?.sendMessage;
      if (!sendMessage) {
        console.warn("sendMessage / handleChatMessage not found in chat.controller");
        return socket.emit("error", { message: "Server missing sendMessage handler" });
      }

      await sendMessage(io, payload);
      // controller's sendMessage is expected to save + emit "newMessage"
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Optional: handle leaving workspace
  socket.on("leaveWorkspace", ({ workspaceId }) => {
    socket.leave(workspaceId);
    console.log(`${socket.id} left workspace ${workspaceId}`);
  });

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});
// ---------------------------------------------------------------------------

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
