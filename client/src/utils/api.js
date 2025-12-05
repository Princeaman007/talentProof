import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Helper pour construire les URLs d'images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${SERVER_URL}/uploads/default-talent-day.svg`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SERVER_URL}${imagePath}`;
};

// Instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT et CSRF automatiquement
api.interceptors.request.use(
  async (config) => {
    // LOG REQUEST CONFIG
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: { ...config.headers },
      data: config.data,
      params: config.params
    });
    
    // 1. Token JWT depuis localStorage - toujours l'ajouter si disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2.  CSRF Token - Récupérer si manquant (pour mutations uniquement)
    if (config.method !== 'get' && !api.defaults.headers.common['X-CSRF-Token']) {
      try {
        const res = await axios.get(`${API_URL}/csrf-token`, {
          withCredentials: true
        });
        const csrfToken = res?.data?.csrfToken;
        if (csrfToken) {
          api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      } catch (err) {
      }
    } else if (config.method !== 'get') {
      // Ajouter le token existant à la requête
      config.headers['X-CSRF-Token'] = api.defaults.headers.common['X-CSRF-Token'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (token expiré, etc.)
api.interceptors.response.use(
  (response) => {
    // LOG RAW RESPONSE
      url: response.config?.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      dataType: typeof response.data
    });
    return response;
  },
  async (error) => {
    // LOG ERROR COMPLETE
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
      fullError: error
    });
    
    const originalRequest = error.config;

    // Gestion du rate limiting (429)
    if (error.response?.status === 429) {
      const formatted429Error = new Error('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer');
      formatted429Error.response = {
        data: {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer',
            statusCode: 429
          }
        }
      };
      return Promise.reject(formatted429Error);
    }

    //  Si erreur CSRF (403), récupérer un nouveau token et réessayer
    if (error.response?.status === 403 && error.response?.data?.code === 'EBADCSRFTOKEN' && !originalRequest._retryCSRF) {
      originalRequest._retryCSRF = true;
      
      try {
        const res = await axios.get(`${API_URL}/csrf-token`, {
          withCredentials: true
        });
        const csrfToken = res?.data?.csrfToken;
        if (csrfToken) {
          api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
          originalRequest.headers['X-CSRF-Token'] = csrfToken;
        }
        return api(originalRequest);
      } catch (csrfErr) {
        return Promise.reject(error);
      }
    }

    // Si 401, tenter de refresh le token JWT SAUF pour /auth/login (credentials incorrects)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;
      return api.post('/auth/refresh')
        .then((refreshResponse) => {
          return api(originalRequest);
        })
        .catch((refreshErr) => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        });
    }

    return Promise.reject(error);
  }
);

// Fetch CSRF token on module load
async function initCsrf() {
  try {
    const res = await api.get('/csrf-token');
    const token = res?.data?.csrfToken;
    if (token) {
      api.defaults.headers.common['X-CSRF-Token'] = token;
    }
  } catch (err) {
  }
}

// Initialize immediately
initCsrf();

export default api;