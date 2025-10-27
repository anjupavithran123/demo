// server.js
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./App.js"; // your Express app
import { handleChatMessage, getMessages } from "./controllers/chat.controller.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in routes/controllers if needed
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a workspace
  socket.on("joinWorkspace", async ({ workspaceId }) => {
    if (!workspaceId) return;
    socket.join(workspaceId);
    console.log(`${socket.id} joined workspace ${workspaceId}`);

    try {
      const pastMessages = await getMessages(workspaceId);
      // Send message history only to this client
      socket.emit("getMessages", pastMessages);
    } catch (err) {
      console.error("getMessages error:", err);
    }
  });

  // Handle incoming messages
  socket.on("chatMessage", async (msg) => {
    try {
      await handleChatMessage(io, msg);
    } catch (err) {
      console.error("handleChatMessage error:", err);
    }
  });

  // Optional: handle leaving workspace
  socket.on("leaveWorkspace", ({ workspaceId }) => {
    socket.leave(workspaceId);
    console.log(`${socket.id} left workspace ${workspaceId}`);
  });

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
