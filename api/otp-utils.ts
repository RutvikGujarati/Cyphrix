import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const OTP_TTL_MS = 5 * 60 * 1000;

function getSecret(): string {
  const s = process.env.OTP_SECRET;
  if (!s) throw new Error('OTP_SECRET env variable is not set');
  return s;
}

export function generateOtp(): string {
  const num = randomBytes(4).readUInt32BE(0) % 900000 + 100000;
  return num.toString();
}

export function signOtp(email: string, otp: string, expiresAt: number): string {
  const payload = `${email.toLowerCase().trim()}:${otp}:${expiresAt}`;
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function createOtpToken(email: string, otp: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + OTP_TTL_MS;
  const token = signOtp(email, otp, expiresAt);
  return { token, expiresAt };
}

export function verifyOtpToken(email: string, otp: string, expiresAt: number, token: string): { valid: boolean; error?: string } {
  if (Date.now() > expiresAt) return { valid: false, error: 'OTP has expired. Please request a new one.' };
  const expected = signOtp(email, otp, expiresAt);
  const valid = timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  if (!valid) return { valid: false, error: 'Invalid OTP code. Please try again.' };
  return { valid: true };
}
