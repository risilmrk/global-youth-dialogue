import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

let memoryServer: any = null;

// Cache connection promise across serverless function invocations
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);

    const isProduction =
      env.NODE_ENV === 'production' ||
      Boolean(process.env.VERCEL) ||
      Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

    if (isProduction && env.MONGODB_URI.includes('127.0.0.1')) {
      logger.error('❌ MONGODB_URI is pointing to localhost on Vercel. Please set MONGODB_URI in Vercel project environment variables to your MongoDB Atlas connection string.');
    }

    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(env.MONGODB_URI, opts)
      .then((m) => {
        logger.info(`✅ Connected to MongoDB at: ${env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
        return m;
      })
      .catch(async (err) => {
        cached.promise = null;
        if (!isProduction) {
          logger.warn(`⚠️ Could not reach external MongoDB (${err.message}). Starting in-memory fallback...`);
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          memoryServer = await MongoMemoryServer.create();
          const memUri = memoryServer.getUri();
          return mongoose.connect(memUri);
        }
        logger.error(`❌ MongoDB connection failed: ${err.message}`);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (memoryServer) {
    await memoryServer.stop();
  }
}
