import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { contactEmailHtml, auditEmailHtml } from './email-template';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getApiBaseUrl(): string | null {
  const url = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL;
  return url?.trim() || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiBase = getApiBaseUrl();
    if (apiBase) {
      const proxyRes = await fetch(`${apiBase.replace(/\/$/, '')}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const payload = await proxyRes.json().catch(() => ({}));
      return res.status(proxyRes.status).json(proxyRes.ok ? payload : { error: payload.error || 'Send failed', detail: payload.detail }));
    }

    const { type, subject, name, email, company, message, audit } = req.body;

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
      html = contactEmailHtml({ name, email, company, message });
      text = message;
    }

    await transporter.sendMail({
      from: `"${name} via Cyphrix" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${name}" <${email}>`,
      subject: subject || `New message from ${name}`,
      text,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to send email', detail: error.message });
  }
}
