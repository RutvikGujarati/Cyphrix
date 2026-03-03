import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { contactEmailHtml, auditEmailHtml } from './email-template';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const json = (status: number, body: object) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(status).json(body);
  };

  try {
    if (req.method !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) {
      console.error('[send-email] SMTP_USER or SMTP_PASS not configured in Vercel');
      return json(500, { error: 'Email service not configured', detail: 'Contact administrator' });
    }

    const { type, subject, name, email, company, message, audit } = req.body || {};

    if (!email || !EMAIL_RE.test(email)) {
      return json(400, { error: 'A valid email address is required' });
    }
    if (!name?.trim()) {
      return json(400, { error: 'Name is required' });
    }
    if (type !== 'audit' && (!message || !String(message).trim())) {
      return json(400, { error: 'Message is required' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    let html: string;
    let text: string;

    if (type === 'audit' && audit) {
      html = auditEmailHtml({
        projectName: name,
        email,
        auditType: audit.auditType,
        telegram: audit.telegram,
        details: audit.details || {},
        notes: audit.notes,
      });
      text = message || `Audit Request: ${audit.auditType} from ${name} (${email})`;
    } else {
      html = contactEmailHtml({ name, email, company, message: String(message || '') });
      text = String(message || '');
    }

    await transporter.sendMail({
      from: `"${name} via Cyphrix" <${smtpUser}>`,
      to: smtpUser,
      replyTo: `"${name}" <${email}>`,
      subject: subject || `New message from ${name}`,
      text,
      html,
    });

    return json(200, { success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[send-email] Error:', err);
    return json(500, { error: 'Failed to send email', detail: msg });
  }
}
