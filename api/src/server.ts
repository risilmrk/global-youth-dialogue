import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 GYDE REST API listening on port ${env.PORT} (${env.NODE_ENV})`);
      logger.info(`📡 API endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
      logger.info(`🩺 Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Database connection closed. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: any) {
    logger.error(`Failed to launch server: ${err.message}`);
    process.exit(1);
  }
}

startServer();
