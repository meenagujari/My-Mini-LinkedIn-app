import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meenagujari88:Q6wYw5ClQaLCIbiV@mini-linkedin-db.1d9twt7.mongodb.net/mini-linkedin?retryWrites=true&w=majority';

let cached = {
  conn: null as typeof mongoose | null,
  promise: null as Promise<typeof mongoose> | null,
};

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB Atlas');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }
}

export default connectDB;