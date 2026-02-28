import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'
import type { Plugin } from 'vite'
import { contactEmailHtml, auditEmailHtml, otpEmailHtml } from './api/email-template'
import { generateOtp, createOtpToken, verifyOtpToken } from './api/otp-utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function parseBody(req: import('http').IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
  });
}

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function localApis(): Plugin {
  return {
    name: 'local-email-api',
    configureServer(server) {

      // --- /api/send-otp ---
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }
        try {
          const { email } = await parseBody(req);
          if (!email || !EMAIL_RE.test(email)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'A valid email address is required' })); return; }

          const otp = generateOtp();
          const { token, expiresAt } = createOtpToken(email, otp);
          console.log('[OTP] Sending to:', email);

          await createTransporter().sendMail({
            from: `"Cyphrix Verification" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} — Your Cyphrix Verification Code`,
            text: `Your Cyphrix verification code is: ${otp}\n\nThis code expires in 5 minutes.`,
            html: otpEmailHtml(otp),
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, token, expiresAt }));
        } catch (err: any) {
          console.error('OTP Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to send verification code', detail: err.message }));
        }
      });

      // --- /api/send-email ---
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }
        try {
          const { type, subject, name, email, company, message, audit, otp, otpToken, otpExpiry } = await parseBody(req);

          if (!email || !EMAIL_RE.test(email)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'A valid email address is required' })); return; }
          if (!name?.trim()) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Name is required' })); return; }

          if (!otp || !otpToken || !otpExpiry) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Email verification is required' })); return; }
          const otpResult = verifyOtpToken(email, otp, otpExpiry, otpToken);
          if (!otpResult.valid) { res.statusCode = 403; res.end(JSON.stringify({ error: otpResult.error })); return; }

          console.log('[SMTP] Sending:', type || 'contact', '| From:', email, '| Subject:', subject);

          let html: string;
          let text: string;
          if (type === 'audit' && audit) {
            html = auditEmailHtml({ projectName: name, email, auditType: audit.auditType, telegram: audit.telegram, details: audit.details || {}, notes: audit.notes });
            text = message || `Audit Request: ${audit.auditType} from ${name} (${email})`;
          } else {
            html = contactEmailHtml({ name, email, company, message });
            text = message;
          }

          await createTransporter().sendMail({
            from: `"${name} via Cyphrix" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            replyTo: `"${name}" <${email}>`,
            subject: subject || `New message from ${name}`,
            text,
            html,
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err: any) {
          console.error('SMTP Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to send email', detail: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.SMTP_USER = env.SMTP_USER;
  process.env.SMTP_PASS = env.SMTP_PASS;
  process.env.OTP_SECRET = env.OTP_SECRET;
  return {
    plugins: [react(), localApis()],
  };
})
