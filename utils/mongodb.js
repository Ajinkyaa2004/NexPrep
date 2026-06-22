import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI environment variable is not set. Database operations will fail.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Add it to your .env.local (e.g. mongodb://127.0.0.1:27017/nexprep).'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Fail fast with a clear error instead of hanging the request.
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
