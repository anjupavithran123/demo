// message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true },
  text: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
