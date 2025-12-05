import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Hook personnalisé pour récupérer les statistiques admin
 *  À utiliser UNIQUEMENT dans les composants admin
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refresh: fetchStats, // Pour rafraîchir manuellement
  };
};

/**
 * Hook pour récupérer les statistiques publiques (entreprises)
 * Affiche les données publiques qui servent de preuve sociale
 */
export const usePublicStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicStats();
  }, []);

  const fetchPublicStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      //  Récupérer toutes les stats publiques en une seule requête
      const response = await api.get('/public/stats');
      
      setStats({
        talentsCount: response.data.stats.talentsValides || 0,
        talentsValides: response.data.stats.talentsValides || 0,
        entreprisesCount: response.data.stats.entreprisesPartenaires || 0,
        entreprisesPartenaires: response.data.stats.entreprisesPartenaires || 0,
        tauxSucces: response.data.stats.tauxSucces || 0,
        totalDemandes: response.data.stats.totalDemandes || 0,
        demandesTraitees: response.data.stats.demandesTraitees || 0,
      });
    } catch (err) {
      setError(err.message);
      // Valeurs par défaut en cas d'erreur
      setStats({
        talentsCount: 0,
        talentsValides: 0,
        entreprisesCount: 0,
        entreprisesPartenaires: 0,
        tauxSucces: 0,
        totalDemandes: 0,
        demandesTraitees: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refresh: fetchPublicStats,
  };
};

/**
 * Hook pour récupérer la timeline avec période personnalisable
 */
export const useTimeline = (period = '6m') => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimeline();
  }, [period]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/stats/timeline?period=${period}`);
      setTimeline(response.data.timeline);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    timeline,
    loading,
    error,
    refresh: fetchTimeline,
  };
};