import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaCheckCircle, FaEnvelope, FaSpinner } from 'react-icons/fa';

const DashboardHome = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    talentsCount: 0,
    entreprisesCount: 0,
    tauxSucces: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Récupérer les statistiques au chargement
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer le nombre de talents
      const talentsResponse = await axios.get('/api/talents');
      const talentsCount = talentsResponse.data.count || 0;
      
      // Récupérer le nombre d'entreprises (si admin)
      let entreprisesCount = 0;
      if (isAdmin) {
        try {
          const entreprisesResponse = await axios.get('/api/admin/entreprises/count');
          entreprisesCount = entreprisesResponse.data.count || 0;
        } catch (error) {
          console.log('Impossible de récupérer le nombre d\'entreprises');
          entreprisesCount = 0;
        }
      }
      
      // Calculer le taux de succès (si tu as les données)
      // Sinon, laisser à 0
      let tauxSucces = 0;
      try {
        const statsResponse = await axios.get('/api/admin/stats');
        tauxSucces = statsResponse.data.tauxSucces || 0;
      } catch (error) {
        console.log('Impossible de récupérer le taux de succès');
        tauxSucces = 0;
      }
      
      setStats({
        talentsCount,
        entreprisesCount,
        tauxSucces,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      // ✅ En cas d'erreur, tout reste à 0
      setStats({
        talentsCount: 0,
        entreprisesCount: 0,
        tauxSucces: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Bienvenue, {user?.nom} ! 👋
        </h1>
        <p className="text-neutral mt-2">
          {isAdmin
            ? 'Gérez vos talents et votre équipe depuis ce tableau de bord.'
            : 'Consultez les meilleurs talents tech validés.'}
        </p>
      </div>

      {/* Stats Cards - ✅ DYNAMIQUES - AUCUNE VALEUR PAR DÉFAUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Talents validés */}
        <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Talents validés</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <p className="text-3xl font-bold mt-1">
                  {stats.talentsCount}
                </p>
              )}
            </div>
            <FaUsers className="text-5xl opacity-20" />
          </div>
        </div>

        {/* Taux de succès */}
        <div className="card bg-gradient-to-br from-secondary to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Taux de succès</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <p className="text-3xl font-bold mt-1">
                  {stats.tauxSucces}%
                </p>
              )}
            </div>
            <FaCheckCircle className="text-5xl opacity-20" />
          </div>
        </div>

        {/* Entreprises */}
        <div className="card bg-gradient-to-br from-accent to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Entreprises</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <p className="text-3xl font-bold mt-1">
                  {stats.entreprisesCount}
                </p>
              )}
            </div>
            <FaEnvelope className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consulter les talents */}
          <Link
            to="/dashboard/talents"
            className="group p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-primary mb-1 group-hover:text-primary-dark transition-colors">
                  Consulter les talents
                </h3>
                <p className="text-sm text-neutral">
                  {stats.talentsCount > 0 
                    ? `Parcourez notre catalogue de ${stats.talentsCount} développeur${stats.talentsCount > 1 ? 's' : ''} validé${stats.talentsCount > 1 ? 's' : ''}`
                    : 'Aucun talent disponible pour le moment'
                  }
                </p>
              </div>
              <FaUsers className="text-primary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Gérer les talents (Admin) */}
          {isAdmin && (
            <Link
              to="/dashboard/admin/talents"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-secondary mb-1 group-hover:text-orange-600 transition-colors">
                    Gérer les talents
                  </h3>
                  <p className="text-sm text-neutral">
                    Ajouter, modifier ou supprimer des talents
                  </p>
                </div>
                <FaUsers className="text-secondary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )}

          {/* Mon profil */}
          <Link
            to="/dashboard/profile"
            className="group p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-primary mb-1 group-hover:text-primary-dark transition-colors">
                  Mon profil
                </h3>
                <p className="text-sm text-neutral">
                  Modifier vos informations d'entreprise
                </p>
              </div>
              <FaEnvelope className="text-primary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Gérer l'équipe (Admin) */}
          {isAdmin && (
            <Link
              to="/dashboard/admin/team"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-secondary mb-1 group-hover:text-orange-600 transition-colors">
                    Gérer l'équipe
                  </h3>
                  <p className="text-sm text-neutral">
                    Ajouter ou modifier les membres
                  </p>
                </div>
                <FaCheckCircle className="text-secondary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Info avec stats dynamiques */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className="font-semibold text-primary mb-2">
              {isAdmin ? 'Mode Administrateur' : 'Astuce'}
            </h3>
            <p className="text-neutral text-sm">
              {isAdmin
                ? stats.talentsCount > 0
                  ? `Vous gérez actuellement ${stats.talentsCount} talent${stats.talentsCount > 1 ? 's' : ''} validé${stats.talentsCount > 1 ? 's' : ''}. Utilisez le panneau d'administration pour ajouter de nouveaux profils ou modifier les existants.`
                  : 'Aucun talent dans la base de données. Commencez par ajouter votre premier talent via "Gérer les talents".'
                : stats.talentsCount > 0
                  ? `Explorez notre catalogue de ${stats.talentsCount} développeur${stats.talentsCount > 1 ? 's' : ''} validé${stats.talentsCount > 1 ? 's' : ''}. Utilisez les filtres par technologie pour trouver rapidement les talents qui correspondent à vos besoins.`
                  : 'Aucun talent disponible pour le moment. Revenez bientôt pour découvrir nos développeurs validés.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Message si aucune donnée */}
      {!loading && stats.talentsCount === 0 && isAdmin && (
        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-700 mb-2">
                Base de données vide
              </h3>
              <p className="text-neutral text-sm mb-3">
                Votre plateforme ne contient aucun talent pour le moment. Pour commencer :
              </p>
              <Link
                to="/dashboard/admin/talents"
                className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Ajouter votre premier talent
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;