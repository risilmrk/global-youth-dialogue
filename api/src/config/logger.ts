import pino from 'pino';
import { env } from './env';

const isServerlessOrProd =
  env.NODE_ENV === 'production' ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.NOW_REGION);

function createLogger() {
  // In production or serverless environments (e.g. Vercel), use direct stdout logger
  if (isServerlessOrProd) {
    return pino({
      level: 'info',
    });
  }

  try {
    return pino({
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'HH:MM:ss Z',
        },
      },
    });
  } catch {
    return pino({ level: 'debug' });
  }
}

export const logger = createLogger();
