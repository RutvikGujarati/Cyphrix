const otpApiBaseUrl = (import.meta.env.VITE_OTP_API_BASE_URL as string | undefined)?.trim();

export const OTP_API_BASE_URL = otpApiBaseUrl || 'http://localhost:8080';
