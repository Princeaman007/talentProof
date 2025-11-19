import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminStats, usePublicStats } from '../../hooks/useAdminStats';
import { FaUsers, FaCheckCircle, FaEnvelope, FaSpinner, FaBuilding, FaChartLine } from 'react-icons/fa';

const DashboardHome = () => {
  const { user, isAdmin } = useAuth();
  
  //  Utiliser le bon hook selon le rôle
  const adminStatsHook = useAdminStats();
  const publicStatsHook = usePublicStats();
  
  // Sélectionner les bonnes stats selon le rôle
  const { stats, loading } = isAdmin ? adminStatsHook : publicStatsHook;

  // Debug: Afficher les stats dans la console
  console.log(' Dashboard Stats:', { stats, loading, isAdmin });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Bienvenue, {user?.nom} ! 
        </h1>
        <p className="text-neutral mt-2">
          {isAdmin
            ? 'Gérez vos talents et votre équipe depuis ce tableau de bord.'
            : 'Consultez les meilleurs talents tech validés.'}
        </p>
      </div>

      Stats Cards
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Talents validés - Visible par tous */}
        <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Talents validés</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <>
                  <p className="text-3xl font-bold mt-1">
                    {stats?.talentsCount || stats?.talentsValides || 0}
                  </p>
                  {isAdmin && stats?.talentsActifs !== undefined && (
                    <p className="text-xs mt-2 opacity-75">
                      {stats.talentsActifs} actifs
                    </p>
                  )}
                </>
              )}
            </div>
            <FaUsers className="text-5xl opacity-20" />
          </div>
        </div>

        {/* Taux de succès - Visible par tous */}
        <div className="card bg-gradient-to-br from-accent to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Taux de succès</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <>
                  <p className="text-3xl font-bold mt-1">
                    {stats?.tauxSucces || 0}%
                  </p>
                  {isAdmin && stats?.totalDemandes !== undefined ? (
                    <p className="text-xs mt-2 opacity-75">
                      {stats.demandesTraitees || 0} / {stats.totalDemandes || 0} demandes
                    </p>
                  ) : (
                    <p className="text-xs mt-2 opacity-75">
                      Demandes traitées
                    </p>
                  )}
                </>
              )}
            </div>
            <FaCheckCircle className="text-5xl opacity-20" />
          </div>
        </div>

        {/* Entreprises inscrites - Visible par tous (preuve sociale) */}
        <div className="card bg-gradient-to-br from-secondary to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Entreprises partenaires</p>
              {loading ? (
                <FaSpinner className="animate-spin text-2xl mt-1" />
              ) : (
                <>
                  <p className="text-3xl font-bold mt-1">
                    {stats?.entreprisesCount || stats?.entreprisesPartenaires || 0}
                  </p>
                  {isAdmin && stats?.entreprisesActives !== undefined ? (
                    <p className="text-xs mt-2 opacity-75">
                      {stats.entreprisesActives} actives
                    </p>
                  ) : (
                    <p className="text-xs mt-2 opacity-75">
                      Actives
                    </p>
                  )}
                </>
              )}
            </div>
            <FaBuilding className="text-5xl opacity-20" />
          </div>
        </div> 
      </div>

      {/* Stats récentes (Admin uniquement) */}
      {isAdmin && stats?.recentStats && (
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">
             Activité des 30 derniers jours
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                +{stats.recentStats.newEntreprises || 0}
              </p>
              <p className="text-sm text-neutral mt-1">Nouvelles entreprises</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                +{stats.recentStats.newTalents || 0}
              </p>
              <p className="text-sm text-neutral mt-1">Nouveaux talents</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                +{stats.recentStats.newContactRequests || 0}
              </p>
              <p className="text-sm text-neutral mt-1">Demandes de contact</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                +{stats.recentStats.newDevis || 0}
              </p>
              <p className="text-sm text-neutral mt-1">Demandes de devis</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statistiques détaillées (Admin) */}
          {isAdmin && (
            <Link
              to="/dashboard/admin/stats"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-primary mb-1 group-hover:text-primary-dark transition-colors">
                    Statistiques avancées
                  </h3>
                  <p className="text-sm text-neutral">
                    Visualisez l'évolution et les performances
                  </p>
                </div>
                <FaChartLine className="text-primary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )}

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
                  {stats?.talentsCount > 0 
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

          {/* Gérer les entreprises (Admin) */}
          {isAdmin && (
            <Link
              to="/dashboard/admin/entreprises"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-accent mb-1 group-hover:text-green-600 transition-colors">
                    Gérer les entreprises
                  </h3>
                  <p className="text-sm text-neutral">
                    Voir et gérer les entreprises inscrites
                  </p>
                </div>
                <FaBuilding className="text-accent text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )}

          {/* Demandes de contact (Admin) */}
          {isAdmin && (
            <Link
              to="/dashboard/admin/contact-requests"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-secondary mb-1 group-hover:text-orange-600 transition-colors">
                    Demandes de contact
                  </h3>
                  <p className="text-sm text-neutral">
                    {stats?.contactRequestsCount || 0} demande{stats?.contactRequestsCount > 1 ? 's' : ''} au total
                  </p>
                </div>
                <FaEnvelope className="text-secondary text-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
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
          <span className="text-2xl"></span>
          <div className="flex-1">
            <h3 className="font-semibold text-primary mb-2">
              {isAdmin ? 'Mode Administrateur' : 'Astuce'}
            </h3>
            <p className="text-neutral text-sm">
              {isAdmin
                ? stats?.talentsCount > 0
                  ? `Vous gérez actuellement ${stats.talentsCount} talent${stats.talentsCount > 1 ? 's' : ''} validé${stats.talentsCount > 1 ? 's' : ''} et ${stats.entreprisesCount || 0} entreprise${stats.entreprisesCount > 1 ? 's' : ''} inscrite${stats.entreprisesCount > 1 ? 's' : ''}. Taux de succès : ${stats.tauxSucces || 0}%.`
                  : 'Aucun talent dans la base de données. Commencez par ajouter votre premier talent via "Gérer les talents".'
                : stats?.talentsCount > 0
                  ? `Explorez notre catalogue de ${stats.talentsCount} développeur${stats.talentsCount > 1 ? 's' : ''} validé${stats.talentsCount > 1 ? 's' : ''} avec un taux de succès de ${stats.tauxSucces || 0}%. Utilisez les filtres par technologie pour trouver rapidement les talents qui correspondent à vos besoins.`
                  : 'Aucun talent disponible pour le moment. Revenez bientôt pour découvrir nos développeurs validés.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Message si aucune donnée */}
      {!loading && stats?.talentsCount === 0 && isAdmin && (
        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">️</span>
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