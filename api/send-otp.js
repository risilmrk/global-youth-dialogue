// Vercel Serverless Function: /api/send-otp
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Try loading nodemailer if available (installed via package.json on Vercel)
let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // Pure TLS fallback will be used if nodemailer is not present
}

// Load config from email_config.json if available, or environment, or fallback
function getConfig() {
  let config = {
    smtp_host: 'smtp.gmail.com',
    smtp_port: 465,
    smtp_user: 'thegyde.verify@gmail.com',
    smtp_pass: 'nwhnmkersbiwwrry',
    from_email: 'thegyde.verify@gmail.com',
    from_name: 'Global Youth Dialogue & Exchange (GYDE)'
  };

  try {
    const configPath = path.join(process.cwd(), 'email_config.json');
    if (fs.existsSync(configPath)) {
      const fileConf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      config = { ...config, ...fileConf };
    }
  } catch (e) {}

  if (process.env.SMTP_USER) config.smtp_user = process.env.SMTP_USER;
  if (process.env.SMTP_PASS) config.smtp_pass = process.env.SMTP_PASS;
  if (process.env.FROM_EMAIL) config.from_email = process.env.FROM_EMAIL;
  if (process.env.FROM_NAME) config.from_name = process.env.FROM_NAME;

  return config;
}

function getEmailContent(code, name) {
  const plainText = `Hello ${name || 'Applicant'},

Your GYDE verification code is: ${code}

Please enter this 6-digit code on the GYDE platform to verify your email address and activate your membership credentials.

This code will expire in 10 minutes. If you did not request this, please disregard this email.

---
Global Youth Dialogue & Exchange (GYDE)
International Community of Youth Debaters
Official Platform: https://www.thegyde.in`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your GYDE Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 26px 20px; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 1.25rem; letter-spacing: 0.05em; font-weight: 700; }
    .header p { margin: 0; font-size: 0.85rem; color: #94a3b8; }
    .content { padding: 30px 24px; text-align: center; }
    .greeting { font-size: 1rem; color: #334155; margin-bottom: 12px; text-align: left; font-weight: 600; }
    .text { font-size: 0.94rem; color: #64748b; line-height: 1.55; margin-bottom: 22px; text-align: left; }
    .otp-box { background: #f1f5f9; border: 2px dashed #4851ba; border-radius: 10px; padding: 18px 28px; display: inline-block; margin: 10px auto 20px; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 2.3rem; font-weight: 800; letter-spacing: 0.35em; color: #4851ba; margin: 0; }
    .notice { font-size: 0.82rem; color: #94a3b8; margin-top: 14px; line-height: 1.45; text-align: center; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Global Youth Dialogue & Exchange</h2>
      <p>Official Membership Verification</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${name || 'Applicant'},</div>
      <div class="text">
        Welcome to GYDE! To verify your email and activate your official debate community credentials, please enter the one-time verification code below:
      </div>
      <div class="otp-box">
        <div class="otp-code">${code}</div>
      </div>
      <div class="notice">
        This verification code is valid for <strong>10 minutes</strong>.<br>
        If you did not request this, please disregard this email.
      </div>
    </div>
    <div class="footer">
      &copy; Global Youth Dialogue & Exchange (GYDE) &bull; International Community of Youth Debaters<br>
      <a href="https://www.thegyde.in" style="color: #4851ba; text-decoration: none;">thegyde.in</a>
    </div>
  </div>
</body>
</html>`;

  return { plainText, htmlBody };
}

function getApprovalEmailContent(name) {
  const plainText = `Hello ${name || 'Member'},

Congratulations! Your application for Community Membership in Global Youth Dialogue & Exchange (GYDE) has been officially approved by the Secretariat.

You can now log in to the platform at https://www.thegyde.in using your registered email address and the password you set during your application.

Welcome to our international community of youth debaters and scholars!

---
Global Youth Dialogue & Exchange (GYDE)
Official Platform: https://www.thegyde.in`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your GYDE Membership Application is Approved!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #064e3b, #047857); color: #ffffff; padding: 28px 20px; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 1.3rem; letter-spacing: 0.04em; font-weight: 700; }
    .header p { margin: 0; font-size: 0.88rem; color: #a7f3d0; }
    .content { padding: 30px 24px; text-align: left; }
    .greeting { font-size: 1.05rem; color: #1e293b; margin-bottom: 14px; font-weight: 700; }
    .text { font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 20px; }
    .action-box { text-align: center; margin: 26px 0; }
    .btn { display: inline-block; background: #047857; color: #ffffff !important; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Global Youth Dialogue & Exchange</h2>
      <p>Official Membership Approval</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${name || 'Member'},</div>
      <div class="text">
        We are thrilled to inform you that your application for Community Membership has been <strong>approved</strong>!
      </div>
      <div class="text">
        You can now sign in to your Member Portal using your registered email and the exact password you created when you submitted your membership application.
      </div>
      <div class="action-box">
        <a href="https://www.thegyde.in" class="btn">Sign In to Member Portal &rarr;</a>
      </div>
      <div class="text" style="font-size: 0.88rem; color: #64748b;">
        As a verified member, you can participate in weekly structured parliamentary dialogues, collaborate on academic research papers, and connect with fellow youth leaders across 14+ nations.
      </div>
    </div>
    <div class="footer">
      &copy; Global Youth Dialogue & Exchange (GYDE) &bull; International Community of Youth Debaters<br>
      <a href="https://www.thegyde.in" style="color: #047857; text-decoration: none;">thegyde.in</a>
    </div>
  </div>
</body>
</html>`;

  return { plainText, htmlBody };
}

// 1. Send via nodemailer (Standard RFC 5322 MIME engine)
async function sendViaNodemailer(toEmail, code, name, conf, isApproval = false) {
  const { plainText, htmlBody } = isApproval ? getApprovalEmailContent(name) : getEmailContent(code, name);
  const fromName = conf.from_name || 'Global Youth Dialogue & Exchange (GYDE)';
  const fromEmail = conf.from_email || conf.smtp_user;

  const transporter = nodemailer.createTransport({
    host: conf.smtp_host || 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL/TLS
    auth: {
      user: conf.smtp_user,
      pass: conf.smtp_pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    replyTo: `"${fromName}" <${fromEmail}>`,
    subject: isApproval 
      ? `Your GYDE Community Membership Application is Approved!` 
      : `${code} is your GYDE Verification Code`,
    text: plainText,
    html: htmlBody,
    headers: {
      'X-Priority': '1 (Highest)',
      'X-MSMail-Priority': 'High',
      'Importance': 'High',
      'Auto-Submitted': 'auto-generated'
    }
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, message: 'Delivered successfully via Nodemailer', messageId: info.messageId };
}

// 2. Pure Node.js TLS fallback with full RFC 5322 headers
function sendViaPureTLS(toEmail, code, name, conf, isApproval = false) {
  const user = conf.smtp_user;
  const pass = conf.smtp_pass;
  const host = conf.smtp_host || 'smtp.gmail.com';
  const port = 465;
  const fromName = conf.from_name || 'Global Youth Dialogue & Exchange (GYDE)';
  const fromEmail = conf.from_email || user;
  const { plainText, htmlBody } = isApproval ? getApprovalEmailContent(name) : getEmailContent(code, name);

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' });
    socket.setEncoding('utf8');

    let step = 0;

    socket.on('data', (data) => {
      const reply = data.toString();

      if (step === 0 && reply.startsWith('220')) {
        step = 1;
        socket.write('EHLO thegyde.in\r\n');
      } else if (step === 1 && reply.startsWith('250')) {
        step = 2;
        socket.write('AUTH LOGIN\r\n');
      } else if (step === 2 && reply.startsWith('334')) {
        step = 3;
        socket.write(Buffer.from(user).toString('base64') + '\r\n');
      } else if (step === 3 && reply.startsWith('334')) {
        step = 4;
        socket.write(Buffer.from(pass).toString('base64') + '\r\n');
      } else if (step === 4 && reply.startsWith('235')) {
        step = 5;
        socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
      } else if (step === 5 && reply.startsWith('250')) {
        step = 6;
        socket.write(`RCPT TO:<${toEmail}>\r\n`);
      } else if (step === 6 && reply.startsWith('250')) {
        step = 7;
        socket.write('DATA\r\n');
      } else if (step === 7 && reply.startsWith('354')) {
        step = 8;
        const boundary = '----=_Part_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const msgId = `<gyde-${Date.now()}-${Math.random().toString(36).slice(2)}@gmail.com>`;
        const dateStr = new Date().toUTCString();
        const subject = isApproval 
          ? `Your GYDE Community Membership Application is Approved!` 
          : `${code} is your GYDE Verification Code`;

        const mimeMessage = [
          `Date: ${dateStr}`,
          `Message-ID: ${msgId}`,
          `From: "${fromName}" <${fromEmail}>`,
          `To: ${toEmail}`,
          `Reply-To: <${fromEmail}>`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `X-Priority: 1 (Highest)`,
          `Importance: High`,
          `Auto-Submitted: auto-generated`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          '',
          `--${boundary}`,
          `Content-Type: text/plain; charset=UTF-8`,
          `Content-Transfer-Encoding: 7bit`,
          '',
          plainText,
          '',
          `--${boundary}`,
          `Content-Type: text/html; charset=UTF-8`,
          `Content-Transfer-Encoding: 8bit`,
          '',
          htmlBody,
          '',
          `--${boundary}--`,
          '',
          '.'
        ].join('\r\n') + '\r\n';

        socket.write(mimeMessage);
      } else if (step === 8 && reply.startsWith('250')) {
        step = 9;
        socket.write('QUIT\r\n');
        resolve({ success: true, message: 'Delivered successfully via RFC TLS' });
      } else if (reply.startsWith('5') || reply.startsWith('4')) {
        reject(new Error(`SMTP Error: ${reply.trim()}`));
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.setTimeout(12000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 12s'));
    });
  });
}

async function sendEmail(toEmail, code, name, isApproval = false) {
  const conf = getConfig();
  const cleanEmail = (toEmail || '').trim();

  if (nodemailer) {
    try {
      return await sendViaNodemailer(cleanEmail, code, name, conf, isApproval);
    } catch (err) {
      console.warn('Nodemailer failed, falling back to pure TLS:', err.message);
    }
  }

  return await sendViaPureTLS(cleanEmail, code, name, conf, isApproval);
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const email = (body.email || '').trim();
    const isApproval = (body.action === 'approval' || body.type === 'approval');
    const code = (body.code || '').trim();
    const name = (body.name || (isApproval ? 'Member' : 'Applicant')).trim();

    if (!email || (!isApproval && !code)) {
      return res.status(400).json({ error: 'Missing email or code parameter.' });
    }

    const result = await sendEmail(email, code, name, isApproval);
    return res.status(200).json({
      success: true,
      sent: true,
      message: result.message || (isApproval ? 'Approval notification email delivered.' : 'Verification email delivered successfully.')
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({
      success: false,
      sent: false,
      error: err.message || 'Failed to dispatch email.'
    });
  }
};
