import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

let memoryServer: any = null;

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);

    // Try connecting to the provided MONGODB_URI with a 2-second timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    logger.info(`✅ Connected to MongoDB at: ${env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
  } catch (err: any) {
    if (env.NODE_ENV !== 'production') {
      logger.warn(`⚠️ Could not reach external MongoDB (${err.message}). Initializing embedded in-memory MongoDB instance for seamless local dev...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        logger.info(`✅ In-memory MongoDB running at: ${memUri}`);
      } catch (memErr: any) {
        logger.error(`❌ Failed to start in-memory MongoDB: ${memErr.message}`);
        throw memErr;
      }
    } else {
      logger.error(`❌ Production MongoDB connection failed: ${err.message}`);
      throw err;
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
