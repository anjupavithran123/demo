import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../lib/socket";
import api from "../../lib/api";

export default function ChatPanel({ workspaceId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch all messages initially
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${workspaceId}`);
        if (res.data) setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [workspaceId]);

  // Socket listeners
  useEffect(() => {
    socket.emit("joinWorkspace", workspaceId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [workspaceId]);

  useEffect(scrollToBottom, [messages]);

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post("/chat", {
        workspaceId,
        senderId: currentUser._id,
        text: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10 text-xl font-semibold">
        💬 Workspace Chat
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-start gap-3 ${
              msg.senderId?._id === currentUser._id ? "justify-end" : ""
            }`}
          >
            {/* Avatar */}
            {msg.senderId?._id !== currentUser._id && (
              <img
                src={msg.senderId?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-white/20"
              />
            )}

            {/* Message bubble */}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl text-sm ${
                msg.senderId?._id === currentUser._id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white/10 text-white rounded-bl-none"
              }`}
            >
              {msg.senderId?._id !== currentUser._id && (
                <p className="text-xs text-white/70 mb-1">
                  {msg.senderId?.name || "Unknown User"}
                </p>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
