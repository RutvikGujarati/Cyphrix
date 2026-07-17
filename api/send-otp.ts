import type { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getOtpApiBaseUrl(): string {
  const explicitUrl = process.env.OTP_API_BASE_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const viteUrl = process.env.VITE_OTP_API_BASE_URL?.trim();
  if (viteUrl) return viteUrl;

  return 'http://localhost:8080';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const otpApiBaseUrl = getOtpApiBaseUrl();
    const response = await fetch(`${otpApiBaseUrl}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const payload = await response.json();
    return res.status(response.status).json(payload);
  } catch (error: unknown) {
    console.error('OTP Error:', error);
    return res.status(500).json({ error: 'Failed to send verification code', detail: error instanceof Error ? error.message : 'Unknown error' });
  }
}
