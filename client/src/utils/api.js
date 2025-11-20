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
    // 📤 LOG REQUEST CONFIG
    console.log('📤 [UTILS/API REQUEST]', {
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
      console.log('🔑 [JWT TOKEN ADDED]', token.substring(0, 20) + '...');
    }

    // 2.  CSRF Token - Récupérer si manquant (pour mutations uniquement)
    if (config.method !== 'get' && !api.defaults.headers.common['X-CSRF-Token']) {
      try {
        console.log('🛡️ [FETCHING CSRF TOKEN]...');
        const res = await axios.get(`${API_URL}/csrf-token`, {
          withCredentials: true
        });
        console.log('📥 [CSRF RESPONSE]', res?.data);
        const csrfToken = res?.data?.csrfToken;
        if (csrfToken) {
          api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
          config.headers['X-CSRF-Token'] = csrfToken;
          console.log('✅ [CSRF TOKEN SET]', csrfToken.substring(0, 20) + '...');
        }
      } catch (err) {
        console.warn('⚠️ [CSRF FETCH ERROR]', err?.message || err);
      }
    } else if (config.method !== 'get') {
      // Ajouter le token existant à la requête
      config.headers['X-CSRF-Token'] = api.defaults.headers.common['X-CSRF-Token'];
      console.log('🛡️ [CSRF TOKEN REUSED]', config.headers['X-CSRF-Token']?.substring(0, 20) + '...');
    }

    return config;
  },
  (error) => {
    console.error('❌ [UTILS/API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (token expiré, etc.)
api.interceptors.response.use(
  (response) => {
    // 📥 LOG RAW RESPONSE
    console.log('📥 [UTILS/API RESPONSE SUCCESS]', {
      url: response.config?.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      dataType: typeof response.data
    });
    console.log('✅ [RETURNING]', 'Full response object');
    return response;
  },
  async (error) => {
    // ❌ LOG ERROR COMPLETE
    console.error('❌ [UTILS/API RESPONSE ERROR]', {
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
      console.warn('⚠️ [RATE LIMIT HIT]', 'Too many requests');
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
      console.error('❌ [REJECTING WITH]', formatted429Error);
      return Promise.reject(formatted429Error);
    }

    //  Si erreur CSRF (403), récupérer un nouveau token et réessayer
    if (error.response?.status === 403 && error.response?.data?.code === 'EBADCSRFTOKEN' && !originalRequest._retryCSRF) {
      console.warn('⚠️ [CSRF ERROR]', 'Retrying with new token...');
      originalRequest._retryCSRF = true;
      
      try {
        const res = await axios.get(`${API_URL}/csrf-token`, {
          withCredentials: true
        });
        const csrfToken = res?.data?.csrfToken;
        if (csrfToken) {
          api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
          originalRequest.headers['X-CSRF-Token'] = csrfToken;
          console.log('✅ [CSRF TOKEN REFRESHED]', 'Retrying request...');
        }
        return api(originalRequest);
      } catch (csrfErr) {
        console.error('❌ [CSRF REFRESH FAILED]', csrfErr);
        return Promise.reject(error);
      }
    }

    // Si 401, tenter de refresh le token JWT SAUF pour /auth/login (credentials incorrects)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      console.warn('⚠️ [AUTH ERROR]', 'Attempting token refresh...');
      originalRequest._retry = true;
      return api.post('/auth/refresh')
        .then((refreshResponse) => {
          console.log('✅ [TOKEN REFRESHED]', 'Retrying original request...');
          return api(originalRequest);
        })
        .catch((refreshErr) => {
          console.error('❌ [TOKEN REFRESH FAILED]', 'Logging out...', refreshErr);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        });
    }

    console.error('❌ [FINAL REJECTION]', error);
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
    console.warn('Unable to fetch CSRF token on startup', err?.message || err);
  }
}

// Initialize immediately
initCsrf();

export default api;