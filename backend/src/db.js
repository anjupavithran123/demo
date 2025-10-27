import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set in env');
  }

  await mongoose.connect(uri, {
    // mongoose handles modern options by default in newer versions
  });

  console.log('MongoDB connected');
};


export default connectDB;
