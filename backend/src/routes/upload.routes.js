// src/routes/upload.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/user.js";

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads")); // backend/uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();

// POST /api/upload/avatar
router.post("/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Save avatar path in DB (relative to backend)
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
