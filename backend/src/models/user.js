import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxLength: 100 },
  email: { type: String, trim: true, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Return only safe fields + default avatar
UserSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar || '/default-avatar.png', // fallback if empty
  };
};

export default mongoose.model('User', UserSchema);
