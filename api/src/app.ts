import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { generalApiLimiter } from './middleware/rateLimit';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration with explicit frontend allowlist and Vercel preview support
const allowedOrigins = [
  env.WEB_ORIGIN,
  env.ADMIN_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, server-to-server) or in allowlist or vercel previews
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Client-App',
      'x-client-app',
    ],
  })
);

// Logging
app.use(
  pinoHttp({
    logger,
    autoLogging: env.NODE_ENV === 'production',
  })
);

// Rate limiting
app.use(generalApiLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Mount REST API routes
app.use(env.API_PREFIX, routes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;
