import Message from "../models/message.js";

// ✅ Get all messages for a specific workspace
export const getMessages = async (workspaceId) => {
  try {
    const messages = await Message.find({ workspaceId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name avatar"); // Include name & avatar from User model

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// ✅ Send a new message and broadcast it via Socket.IO
export const sendMessage = async (io, { workspaceId, senderId, text }) => {
  try {
    const message = new Message({
      workspaceId,
      senderId,
      text,
    });

    await message.save();

    // Populate the sender's name and avatar before emitting
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "name avatar");

    // Emit to all users in the workspace room
    io.to(workspaceId).emit("newMessage", populatedMessage);

    return populatedMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const handleChatMessage = sendMessage; // alias for backward-compatibility
