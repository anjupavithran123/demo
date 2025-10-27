// generateSecret.js
import { randomBytes } from 'crypto';

const secret = randomBytes(64).toString('hex'); // 128 characters
console.log('JWT Secret:', secret);
