import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'; // auth routes
import chatRoutes from './routes/chat.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.routes.js'



// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  }));
app.use(express.json());

// Serve static files (uploaded images)
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check
app.get('/ping', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);



// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));

export default app;
