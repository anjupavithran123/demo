// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

// Lazy JWT secret loader
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set — make sure dotenv.config() runs before server start');
  return secret;
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    console.error('Auth verify error', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
