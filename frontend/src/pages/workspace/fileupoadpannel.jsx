// src/pages/workspace/ProfilePanel.jsx
import { useState } from "react";
import axios from "axios";

export default function ProfilePanel({ user, setUser }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/api/users/profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user profilePic in parent state
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

      <img
        src={`http://localhost:4000${user.profilePic || "/default-avatar.png"}`}
        alt={user.name}
        className="w-32 h-32 rounded-full object-cover border-2 border-indigo-600 mb-4"
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload New Picture
      </button>
    </div>
  );
}
