import axios from 'axios';
import { translateError } from '../utils/errorTranslations';

// Protection contre les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Configuration de base pour axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies (JWT)
});

/**
 * Intercepteur de requêtes
 * Ajoute automatiquement le token si disponible
 */
api.interceptors.request.use(
  (config) => {
    // LOG REQUEST CONFIG
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    // Le token est géré par les cookies (httpOnly)
    // Mais on peut ajouter un token localStorage en fallback
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 * Gère automatiquement les erreurs et la traduction
 */
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
    
    // CORRECTION: Retourner response complet (pas response.data)
    // Les composants accèdent à response.data eux-mêmes
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Gestion des erreurs réseau
    if (!error.response) {
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: translateError('NETWORK_ERROR'),
        },
      });
    }

    const { status, data } = error.response;

    // Gestion spéciale du rate limiting (429)
    if (status === 429) {
      return Promise.reject({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: translateError('TOO_MANY_REQUESTS'),
          statusCode: 429,
        },
      });
    }

    // Si 401 et qu'on a un refresh token, essayer de refresh (une seule fois)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Déjà en train de refresh, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Appel du endpoint refresh (utilise le cookie refreshToken)
        await api.post('/auth/refresh');
        isRefreshing = false;
        processQueue(null);
        
        // Retry la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh a échoué, nettoyer et rediriger
        isRefreshing = false;
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Dispatch un événement custom pour que l'app puisse réagir
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: translateError('TOKEN_EXPIRED'),
          },
        });
      }
    }

    // Formater l'erreur de manière cohérente avec traduction française
    const errorCode = data?.error?.code || data?.code || 'UNKNOWN_ERROR';
    const formattedError = {
      success: false,
      error: {
        code: errorCode,
        message: translateError(errorCode, data?.error?.message), // Toujours traduire le code
        details: data?.error?.details || null,
        statusCode: status,
      },
    };

      url: originalRequest?.url,
      method: originalRequest?.method,
      status,
      errorData: data,
      formattedError,
      fullError: error
    });
    return Promise.reject(formattedError);
  }
);

/**
 * Service API avec méthodes utilitaires
 */
const apiService = {
  // Authentification
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    confirmEmail: (token) => api.get(`/auth/confirm/${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
  },

  // Companies
  companies: {
    register: (data) => api.post('/companies', data),
    getById: (id) => api.get(`/companies/${id}`),
    update: (id, data) => api.put(`/companies/${id}`, data),
  },

  // TalentDays
  talentDays: {
    getAll: (params) => api.get('/talent-days', { params }),
    getById: (id) => api.get(`/talent-days/${id}`),
    register: (id) => api.post(`/talent-days/${id}/register`),
    cancel: (id) => api.post(`/talent-days/${id}/cancel`),
    getMyRegistrations: () => api.get('/talent-days/my-registrations'),
  },

  // Talents
  talents: {
    getAll: (params) => api.get('/talents', { params }),
    getById: (id) => api.get(`/talents/${id}`),
    search: (filters) => api.post('/talents/search', filters),
  },

  // Favoris
  favorites: {
    getAll: () => api.get('/favoris'),
    add: (talentId) => api.post('/favoris', { talentId }),
    remove: (talentId) => api.delete(`/favoris/${talentId}`),
    check: (talentId) => api.get(`/favoris/check/${talentId}`),
  },

  // Notifications
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
  },

  // Contact
  contact: {
    send: (data) => api.post('/contact', data),
  },

  // Team Members (pour entreprises)
  team: {
    getAll: () => api.get('/team'),
    add: (data) => api.post('/team', data),
    update: (id, data) => api.put(`/team/${id}`, data),
    remove: (id) => api.delete(`/team/${id}`),
  },

  // Admin (si rôle admin)
  admin: {
    getStats: () => api.get('/admin/stats'),
    getCompanies: (params) => api.get('/admin/companies', { params }),
    getTalents: (params) => api.get('/admin/talents', { params }),
    getTalentDays: (params) => api.get('/admin/talent-days', { params }),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
  },
};

/**
 * Helper pour les uploads de fichiers
 * 
 * @param {string} endpoint - URL de l'endpoint
 * @param {FormData} formData - Données du formulaire avec fichiers
 * @param {function} onProgress - Callback pour progression (optionnel)
 */
export const uploadFile = async (endpoint, formData, onProgress = null) => {
  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Helper pour gérer les erreurs dans les composants
 * 
 * Usage:
 * try {
 *   await apiService.auth.login(data);
 * } catch (error) {
 *   const { message, details } = handleApiError(error);
 *   setError(message);
 *   setErrorDetails(details);
 * }
 */
export const handleApiError = (error) => {
  if (error?.error) {
    return {
      message: translateError(error.error.code, error.error.message),
      details: error.error.details || null,
      code: error.error.code,
    };
  }
  
  return {
    message: translateError('UNKNOWN_ERROR'),
    details: null,
    code: 'UNKNOWN_ERROR',
  };
};

export { api };
export default apiService;
