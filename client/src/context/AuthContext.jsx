import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { extractErrorMessage } from '../utils/errorHandler';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false); //  Protection contre appels multiples

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      checkIsAdmin(parsedUser);
    }
    // Try to initialize CSRF token for the app (useful if server rotated tokens)
    (async () => {
      try {
        const res = await api.get('/csrf-token');
        const csrf = res?.data?.csrfToken;
        if (csrf) api.defaults.headers.common['X-CSRF-Token'] = csrf;
      } catch (e) {
        // ignore — will be fetched on demand
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //  NOUVEAU - Phase 4 - Vérifier si l'utilisateur est admin
  const checkIsAdmin = (userData) => {
    // MÉTHODE 1 (RECOMMANDÉE) - Vérifier le champ role
    if (userData.role === 'admin') {
      setIsAdmin(true);
      return;
    }

    // MÉTHODE 2 (FALLBACK) - Vérifier l'email (ancienne méthode)
    const adminEmails = ['info@princeaman.dev', 'tobin0031@gmail.com'];
    if (adminEmails.includes(userData.email)) {
      setIsAdmin(true);
      return;
    }

    setIsAdmin(false);
  };

  // Connexion
  const login = async (email, password) => {
    //  Protection: Si déjà en train de se connecter, ignorer
    if (isLoggingIn) {
      return { success: false, message: 'Connexion en cours...' };
    }
    
    
    setIsLoggingIn(true);
    setError(null); 
    
    try {
      const response = await api.post('/auth/login', { email, password });
      // L'API retourne l'objet response complet, donc accéder à response.data
      
      
      const { token, data } = response.data;

      if (!token) {
        return { success: false, message: 'Token manquant dans la réponse' };
      }


      //  Sauvegarder le token ET les données utilisateur
      // Note: Cookies HttpOnly ne fonctionnent pas avec des domaines séparés sur Render
      // (talentproof.onrender.com ≠ talentproof-client.onrender.com)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));


      // Mettre à jour l'état
      setToken(token);
      setUser(data);
      checkIsAdmin(data);


      // Refresh CSRF token after successful auth (server may rotate cookie)
      try {
        const csrfRes = await api.get('/csrf-token');
        const csrfToken = csrfRes?.data?.csrfToken;
        if (csrfToken) api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      } catch (csrfErr) {
        // Non-fatal
        // eslint-disable-next-line no-console
      }

      return { success: true, data };
    } catch (error) {
      const message = extractErrorMessage(error, 'Erreur de connexion');
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Inscription
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      
      // After register, attempt to fetch CSRF token (if backend set cookies)
      try {
        const csrfRes = await api.get('/csrf-token');
        const csrfToken = csrfRes?.data?.csrfToken;
        if (csrfToken) api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      } catch (csrfErr) {
        // ignore
      }
      
      //  Retourner response.data qui contient { success, message, data }
      return response.data;
    } catch (error) {
      // L'interceptor axios formate déjà l'erreur
      const message = extractErrorMessage(error, 'Erreur lors de l\'inscription');
      return { success: false, message };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      //  SÉCURITÉ: Appeller l'endpoint logout pour nettoyer le cookie
      await api.post('/auth/logout');
    } catch (error) {
    }
    
    // Nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  // Mettre à jour le profil
  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      const updatedUser = response.data.data;

      // Mettre à jour localStorage et state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      //  Revérifier le statut admin après mise à jour
      checkIsAdmin(updatedUser);

      return { success: true, data: updatedUser };
    } catch (error) {
      const message = extractErrorMessage(error, 'Erreur lors de la mise à jour');
      return { success: false, message };
    }
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true, message: 'Mot de passe modifié avec succès' };
    } catch (error) {
      
      // Extraire le message d'erreur du backend
      let message = 'Erreur lors du changement de mot de passe';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAdmin, 
    //  CORRECTION: Vérifier token dans state ET localStorage pour éviter les problèmes de timing
    isAuthenticated: !!token || !!localStorage.getItem('token'),
    error,
    setError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};