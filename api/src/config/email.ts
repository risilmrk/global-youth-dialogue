import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

if (env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!transporter) {
    logger.info(`[DEV EMAIL MOCK] To: ${options.to} | Subject: "${options.subject}"`);
    if (env.NODE_ENV !== 'production') {
      logger.info(`[DEV EMAIL CONTENT] Snippet:\n${options.text}`);
    }
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`📧 Email successfully dispatched to: ${options.to}`);
    return true;
  } catch (error: any) {
    logger.error(`❌ Email dispatch error to ${options.to}: ${error.message}`);
    return false;
  }
}
