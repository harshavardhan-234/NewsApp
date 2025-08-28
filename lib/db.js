import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news_portal';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      }).then((mongoose) => mongoose);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw new Error('Database connection failed. Please ensure MongoDB is running on localhost:27017');
    }
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    cached.promise = null; // Reset promise so it can retry
    throw new Error('Database connection failed. Please ensure MongoDB is running on localhost:27017');
  }
}

export default connectDB;
