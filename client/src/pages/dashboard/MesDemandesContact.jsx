import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  FaHistory,
  FaSpinner,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCalendar,
} from 'react-icons/fa';
import { TECH_COLORS } from '../../utils/constants';

const MesDemandesContact = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState('all'); // all, nouveau, traité
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchDemandes();
  }, [statutFilter, pagination.currentPage]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/entreprise/contact-requests', {
        params: {
          page: pagination.currentPage,
          limit: 10,
          statut: statutFilter,
        },
      });

      setDemandes(response.data.contactRequests);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur récupération demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTechColor = (tech) => {
    return TECH_COLORS[tech] || TECH_COLORS.default;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: pagination.totalItems,
    nouveau: demandes.filter((d) => d.statut === 'nouveau').length,
    traité: demandes.filter((d) => d.statut === 'traité').length,
  };

  if (loading && demandes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <FaHistory className="text-secondary mr-3" />
          Mes Demandes de Contact
        </h1>
        <p className="text-neutral mt-2">
          Consultez l'historique de vos demandes de contact envoyées aux talents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Demandes</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <FaEnvelope className="text-5xl opacity-20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">En attente</p>
              <p className="text-3xl font-bold mt-1">{stats.nouveau}</p>
            </div>
            <FaClock className="text-5xl opacity-20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Traitées</p>
              <p className="text-3xl font-bold mt-1">{stats.traité}</p>
            </div>
            <FaCheckCircle className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Filtre statut */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <p className="font-semibold text-neutral">Filtrer par statut :</p>
          <div className="flex space-x-2">
            {['all', 'nouveau', 'traité'].map((status) => (
              <button
                key={status}
                onClick={() => setStatutFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statutFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-neutral hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Toutes' : status === 'nouveau' ? 'En attente' : 'Traitées'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      {demandes.length === 0 ? (
        <div className="card text-center py-12">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral mb-2">
            Aucune demande pour le moment
          </h3>
          <p className="text-neutral mb-4">
            Parcourez les talents et envoyez votre première demande de contact
          </p>
          <a
            href="/dashboard/talents"
            className="inline-block btn-primary"
          >
            Découvrir les talents
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande) => {
            const talent = demande.talent;
            
            return (
              <div
                key={demande._id}
                className={`card hover:shadow-lg transition ${
                  demande.statut === 'nouveau'
                    ? 'border-l-4 border-l-orange-500'
                    : 'border-l-4 border-l-green-500'
                }`}
              >
                {/* Header avec talent */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {talent?.photo ? (
                      <img
                        src={talent.photo}
                        alt={talent.prenom}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {talent?.prenom?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-primary">
                        {talent?.prenom || 'Talent supprimé'}
                      </h3>
                      {talent && (
                        <p className="text-sm text-neutral">
                          {talent.typeProfil} {talent.niveau} • Score: {talent.scoreTest}/100
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Statut */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      demande.statut === 'nouveau'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {demande.statut === 'nouveau' ? '⏳ En attente' : '✅ Traitée'}
                  </span>
                </div>

                {/* Technologies */}
                {talent?.technologies && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {talent.technologies.slice(0, 5).map((tech, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                      {talent.technologies.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          +{talent.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Informations de la demande */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-neutral-dark">
                    <FaUser className="text-primary" />
                    <span>{demande.recruteurNom}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-dark">
                    <FaEnvelope className="text-primary" />
                    <span>{demande.recruteurEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-dark">
                    <span>📞</span>
                    <span>{demande.recruteurTel}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-dark">
                    <FaCalendar className="text-primary" />
                    <span>{formatDate(demande.createdAt)}</span>
                  </div>
                </div>

                {/* Message envoyé */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-800 mb-1">
                    Votre message :
                  </p>
                  <p className="text-sm text-neutral">{demande.message}</p>
                </div>

                {/* Footer info */}
                {demande.statut === 'nouveau' && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      ⏳ Votre demande est en cours de traitement. Vous serez contacté prochainement.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between card">
          <p className="text-sm text-neutral">
            Page {pagination.currentPage} sur {pagination.totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, currentPage: p.currentPage - 1 }))
              }
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Précédent
            </button>
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, currentPage: p.currentPage + 1 }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark transition"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      {demandes.length > 0 && (
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-2">
                À propos du traitement
              </h3>
              <p className="text-neutral text-sm">
                Lorsque votre demande est marquée comme "Traitée", cela signifie que
                TalentProof a examiné votre demande et vous contactera directement avec
                les informations complètes du talent (CV, portfolio, etc.).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesDemandesContact;