import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  FaSearch,
  FaFilter,
  FaCheck,
  FaTrash,
  FaSpinner,
  FaEnvelope,
  FaStar,
  FaBuilding,
  FaUser,
} from 'react-icons/fa';

const AdminContactRequests = () => {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({ nouveau: 0, traité: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('all'); // all, nouveau, traité
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [selectedDemande, setSelectedDemande] = useState(null);

  useEffect(() => {
    fetchDemandes();
  }, [statutFilter, pagination.currentPage, search]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/contact-requests', {
        params: {
          page: pagination.currentPage,
          limit: 10,
          statut: statutFilter,
          search,
        },
      });

      setDemandes(response.data.contactRequests);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur récupération demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (demandeId, newStatus) => {
    try {
      await api.put(`/admin/contact-requests/${demandeId}/status`, {
        statut: newStatus,
      });
      fetchDemandes();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (demandeId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette demande ?')) return;

    try {
      await api.delete(`/admin/contact-requests/${demandeId}`);
      alert('Demande supprimée avec succès');
      fetchDemandes();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          📬 Gestion des Demandes de Contact
        </h1>
        <p className="text-neutral mt-2">
          Gérez les demandes de contact des entreprises pour les talents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <FaEnvelope className="text-3xl text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Nouvelles</p>
              <p className="text-2xl font-bold text-orange-600">{stats.nouveau}</p>
            </div>
            <FaEnvelope className="text-3xl text-orange-600 opacity-20" />
          </div>
        </div>
        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Traitées</p>
              <p className="text-2xl font-bold text-green-600">{stats.traité}</p>
            </div>
            <FaCheck className="text-3xl text-green-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, entreprise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="nouveau">Nouvelles</option>
              <option value="traité">Traitées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 card">
            <FaSpinner className="animate-spin text-primary text-3xl" />
          </div>
        ) : demandes.length === 0 ? (
          <div className="text-center py-12 card">
            <FaEnvelope className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-neutral">Aucune demande trouvée</p>
          </div>
        ) : (
          demandes.map((demande) => (
            <div
              key={demande._id}
              className={`card hover:shadow-lg transition cursor-pointer ${
                demande.statut === 'nouveau' ? 'border-l-4 border-l-orange-500' : ''
              }`}
              onClick={() =>
                setSelectedDemande(
                  selectedDemande?._id === demande._id ? null : demande
                )
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {demande.talent?.prenom?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">
                        {demande.talent?.prenom || 'Talent supprimé'}
                      </h3>
                      {demande.talent?.technologies && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {demande.talent.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Infos recruteur */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2 text-neutral-dark">
                      <FaUser className="text-primary" />
                      <span>{demande.recruteurNom}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-neutral-dark">
                      <FaBuilding className="text-primary" />
                      <span>{demande.entreprise}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-neutral-dark">
                      <FaEnvelope className="text-primary" />
                      <span>{demande.recruteurEmail}</span>
                    </div>
                    <div className="text-neutral-dark">
                      📞 {demande.recruteurTel}
                    </div>
                  </div>

                  {/* Message - Affiché si sélectionné */}
                  {selectedDemande?._id === demande._id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-neutral-dark mb-1">
                        Message :
                      </p>
                      <p className="text-sm text-neutral">{demande.message}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 text-xs text-neutral">
                    <span>Reçue le {formatDate(demande.createdAt)}</span>
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
                        demande.statut === 'nouveau'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {demande.statut === 'nouveau' ? 'Nouvelle' : 'Traitée'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  {demande.statut === 'nouveau' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeStatus(demande._id, 'traité');
                      }}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Marquer comme traitée"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeStatus(demande._id, 'nouveau');
                      }}
                      className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                      title="Marquer comme non traitée"
                    >
                      <FaEnvelope />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(demande._id);
                    }}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
    </div>
  );
};

export default AdminContactRequests;