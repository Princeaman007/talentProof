import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ SÉCURITÉ: Inclure les cookies dans les requêtes (pour les HttpOnly cookies)
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT automatiquement (fallback)
api.interceptors.request.use(
  (config) => {
    // Le token HttpOnly est automatiquement inclus via withCredentials
    // Cette partie est pour compatibilité si token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (token expiré, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // If we get 401, try to refresh once and retry the request
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      return api.post('/auth/refresh')
        .then((res) => {
          // The server should set new cookies (access + refresh) via HttpOnly cookies.
          // If your backend also returns a token in the body for compatibility, you can
          // store it in localStorage here. We simply retry the original request.
          return api(originalRequest);
        })
        .catch((refreshErr) => {
          // Refresh failed — clear client state and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        });
    }

    return Promise.reject(error);
  }
);

// Fetch CSRF token on module load (double-submit cookie pattern)
async function initCsrf() {
  try {
    const res = await api.get('/csrf-token');
    const token = res?.data?.csrfToken;
    if (token) {
      api.defaults.headers.common['X-CSRF-Token'] = token;
    }
  } catch (err) {
    // ignore — CSRF token will be requested on demand by the app if needed
    // but log to console for developer visibility
    // eslint-disable-next-line no-console
    console.warn('Unable to fetch CSRF token on startup', err?.message || err);
  }
}

// Try to initialize immediately (no await required by callers)
initCsrf();

export default api;