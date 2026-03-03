/** Production: always use server. Dev: use VITE_API_BASE_URL or localhost:8080 */
const API_BASE = import.meta.env.DEV
  ? (String(import.meta.env.VITE_API_BASE_URL || '').trim() || 'http://localhost:8080').replace(/\/$/, '')
  : 'https://cyphrixtech-server.vercel.app';

const BASE = API_BASE;

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const text = await res.text();
  let data: { error?: string; detail?: string } = {};
  try {
    data = text ? (JSON.parse(text) as { error?: string; detail?: string }) : {};
  } catch {
    if (!res.ok) {
      throw new Error(res.status === 404 ? 'API not found. Is the backend running?' : 'Server returned an unexpected response. Please try again.');
    }
    throw new Error('Server returned an unexpected response. Please try again.');
  }
  if (!res.ok) {
    throw new Error(data.detail || data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  sendOtp: (email: string) =>
    request<{ success: boolean; expiresAt?: number }>('/api/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ success: boolean }>('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  sendEmail: (payload: {
    type: 'contact' | 'audit';
    subject: string;
    name: string;
    email: string;
    company?: string;
    message?: string;
    audit?: { auditType: string; telegram?: string; details: Record<string, string>; notes?: string };
  }) =>
    request<{ success: boolean }>('/api/send-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
