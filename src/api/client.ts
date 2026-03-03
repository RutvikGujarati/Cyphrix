/**
 * API client for Cyphrix backend.
 * Uses VITE_API_BASE_URL from env. Defaults to http://localhost:8080 in dev when not set.
 */
const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (url !== undefined && url !== null) {
    const trimmed = String(url).trim();
    if (trimmed) return trimmed.replace(/\/$/, '');
  }
  return import.meta.env.DEV ? 'http://localhost:8080' : '';
};

const BASE = getBaseUrl();

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
