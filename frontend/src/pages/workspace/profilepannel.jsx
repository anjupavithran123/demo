// src/pages/workspace/profilepannel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePanel() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL = "http://localhost:4000";

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          ...res.data.user,
          avatar:
            res.data.user.avatar && res.data.user.avatar !== ""
              ? res.data.user.avatar
              : "/uploads/default-avatar.png",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchUser();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Select an image first");

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.post(`${BACKEND_URL}/api/upload/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success && res.data.avatar) {
        setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <p className="text-white mt-10">Loading profile...</p>;

  return (
<div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
  
  {/* Floating Blobs */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="blob bg-purple-400/40 w-72 h-72 top-[-100px] left-[-100px] animate-blob"></div>
    <div className="blob bg-pink-400/30 w-96 h-96 bottom-[-150px] right-[-150px] animate-blob animation-delay-2000"></div>
    <div className="blob bg-indigo-400/30 w-80 h-80 top-1/3 left-1/2 animate-blob animation-delay-4000"></div>
  </div>



      {/* Profile Card */}
      <div className="relative bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 w-80 z-10">
        <img
          src={`${BACKEND_URL}${user.avatar}`}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
        />
        <h2 className="text-xl font-semibold text-white">{user.name}</h2>
        <p className="text-white/90">{user.email}</p>

       {/* Upload */}
{/* Upload Avatar Section */}
<div className="mt-4 w-full flex flex-col items-center gap-2">
  <label className="w-full cursor-pointer">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      className="hidden"
    />
    <div className="w-full px-6 py-2 bg-indigo-600 text-white font-medium text-center rounded-lg hover:bg-indigo-700 transition-all duration-200">
      {file ? file.name : "Choose Profile"}
    </div>
  </label>

  <button
    onClick={handleUpload}
    disabled={uploading || !file}
    className={`w-full px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 ${
      !file ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {uploading ? "Uploading..." : "Upload ProfilePic"}
  </button>
</div>

 </div>
      

      {/* Tailwind CSS animation for blobs */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
