// Template API helper for kl-smartq frontend.
// Copy this file into your kl-smartq project at `src/api/auth.ts` and update
// imports as needed. It expects a Vite env variable `import.meta.env.VITE_API_URL`
// or for CRA use process.env.REACT_APP_API_URL.

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : (typeof process !== 'undefined' && process.env.REACT_APP_API_URL)
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:8081/api';

async function post(path: string, body: any, includeCredentials = false) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    credentials: includeCredentials ? 'include' : 'same-origin'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export function sendVerificationCode(email: string) {
  return post('/auth/send-verification-code', { email });
}

export function verifyCode(email: string, code: string) {
  return post('/auth/verify-code', { email, code });
}

export function completeRegistration(email: string, name: string, password: string, confirmPassword: string) {
  return post('/auth/complete-registration', { email, name, password, confirmPassword });
}

export function register(name: string, email: string, password: string, confirmPassword: string) {
  return post('/auth/register', { name, email, password, confirmPassword });
}

export function login(email: string, password: string) {
  return post('/auth/login', { email, password });
}

export async function validateToken(token: string) {
  const res = await fetch(`${API_BASE}/auth/validate`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export default { sendVerificationCode, verifyCode, completeRegistration, register, login, validateToken };
