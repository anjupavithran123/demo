import React, { useEffect, useState } from "react";
import ChatPanel from "./chatpannel";
import WhiteboardPanel from "./whiteboard";
import ProfilePanel from "./profilepannel";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WorkspaceLayout() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load current logged-in user
  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUser = res?.data?.user ?? null;
        setUser(fetchedUser);
      } catch (err) {
        console.error("Failed to load user:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(err?.response?.data?.message ?? err.message ?? "Unknown error");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [navigate]);

  // Helper to get profile picture URL
  const getProfilePicUrl = (u) => {
    if (!u) return "/uploads/default-avatar.png";
    const pic = u.avatar || u.profilePic || "/uploads/default-avatar.png";
    if (pic.startsWith("http")) return pic;
    return `http://localhost:4000${pic.startsWith("/") ? pic : `/${pic}`}`;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-indigo-600 text-white">
        <h1 className="text-lg font-bold">Workspace Dashboard</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={activeTab === "chat" ? "underline" : ""}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("whiteboard")}
            className={activeTab === "whiteboard" ? "underline" : ""}
          >
            Whiteboard
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "underline" : ""}
          >
            Home
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {loadingUser ? (
            <div className="text-sm">Loading...</div>
          ) : user ? (
            <>
              <span className="font-medium">{user.name ?? user.username ?? user.email}</span>
              <img
                src={getProfilePicUrl(user)}
                alt={user.name ?? "User"}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 bg-white text-indigo-600 rounded"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {activeTab === "profile" && <ProfilePanel />}
        {activeTab === "chat" && user &&<ChatPanel workspaceId="1" currentUser={user} />}
        {activeTab === "whiteboard" && user && <WhiteboardPanel user={user} />}
      </main>
    </div>
  );
}
