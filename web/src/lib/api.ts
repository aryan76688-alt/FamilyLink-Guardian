import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export async function ensureAuthToken(): Promise<string> {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem('token');
  if (existing) return existing;

  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'guardian@familylink.local',
      password: 'Password123!',
    });
    if (res.data?.accessToken) {
      const token: string = res.data.accessToken;
      localStorage.setItem('token', token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return token;
    }
  } catch (err) {
    console.warn('[API Auth] Auto login token request failed:', err);
  }
  return '';
}

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('token');
    if (!token && !config.url?.includes('/api/auth/login') && !config.url?.includes('/api/auth/register')) {
      token = await ensureAuthToken();
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest._retry && !originalRequest.url?.includes('/api/auth/login')) {
        originalRequest._retry = true;
        localStorage.removeItem('token');
        const newToken = await ensureAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
