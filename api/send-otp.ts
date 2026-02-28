import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { generateOtp, createOtpToken } from './otp-utils';
import { otpEmailHtml } from './email-template';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const otp = generateOtp();
  const { token, expiresAt } = createOtpToken(email, otp);

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cyphrix Verification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${otp} — Your Cyphrix Verification Code`,
      text: `Your Cyphrix verification code is: ${otp}\n\nThis code expires in 5 minutes.\nIf you didn't request this, please ignore this email.`,
      html: otpEmailHtml(otp),
    });

    return res.status(200).json({ success: true, token, expiresAt });
  } catch (error: any) {
    console.error('OTP SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to send verification code', detail: error.message });
  }
}
