import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

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

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // ✅ Vérifier si admin (role ou email)
      checkIsAdmin(parsedUser);
    }
    setLoading(false);
  }, []);

  // ✅ NOUVEAU - Phase 4 - Vérifier si l'utilisateur est admin
  const checkIsAdmin = (userData) => {
    // MÉTHODE 1 (RECOMMANDÉE) - Vérifier le champ role
    if (userData.role === 'admin') {
      setIsAdmin(true);
      return;
    }

    // MÉTHODE 2 (FALLBACK) - Vérifier l'email (ancienne méthode)
    const adminEmails = ['info@princeaman.dev', 'tobin0031@gmail.com'];
    if (adminEmails.includes(userData.email)) {
      console.warn('⚠️ Admin détecté via email (ancienne méthode). Le backend devrait utiliser le champ "role".');
      setIsAdmin(true);
      return;
    }

    setIsAdmin(false);
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));

      // Mettre à jour l'état
      setToken(token);
      setUser(data);
      checkIsAdmin(data);

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  // Inscription
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      return { success: false, message };
    }
  };

  // Déconnexion
  const logout = () => {
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
      
      // ✅ Revérifier le statut admin après mise à jour
      checkIsAdmin(updatedUser);

      return { success: true, data: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      return { success: false, message };
    }
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAdmin, // ✅ Détecte automatiquement via role ou email
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};