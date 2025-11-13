import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  FaSearch,
  FaFilter,
  FaBan,
  FaCheckCircle,
  FaEye,
  FaSpinner,
  FaBuilding,
  FaEnvelope,
  FaCalendar,
} from 'react-icons/fa';

const AdminEntreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive, suspended
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    fetchEntreprises();
  }, [statusFilter, pagination.currentPage, search]);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/entreprises', {
        params: {
          page: pagination.currentPage,
          limit: 10,
          search,
          status: statusFilter,
        },
      });

      setEntreprises(response.data.entreprises);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur récupération entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspensionReason.trim()) {
      alert('Veuillez indiquer une raison de suspension');
      return;
    }

    try {
      await api.put(`/admin/entreprises/${selectedEntreprise._id}/suspend`, {
        reason: suspensionReason,
      });
      alert('Entreprise suspendue avec succès');
      setShowSuspendModal(false);
      setSuspensionReason('');
      setSelectedEntreprise(null);
      fetchEntreprises();
    } catch (error) {
      console.error('Erreur suspension:', error);
      alert('Erreur lors de la suspension');
    }
  };

  const handleActivate = async (entrepriseId) => {
    if (!confirm('Voulez-vous réactiver cette entreprise ?')) return;

    try {
      await api.put(`/admin/entreprises/${entrepriseId}/activate`);
      alert('Entreprise réactivée avec succès');
      fetchEntreprises();
    } catch (error) {
      console.error('Erreur activation:', error);
      alert('Erreur lors de la réactivation');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">🏢 Gestion des Entreprises</h1>
        <p className="text-neutral mt-2">
          Gérez les entreprises inscrites sur TalentProof
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-neutral mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-600">{pagination.totalItems}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-neutral mb-1">Actives</p>
          <p className="text-2xl font-bold text-green-600">
            {entreprises.filter((e) => e.isActive && !e.suspendedAt).length}
          </p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-neutral mb-1">Suspendues</p>
          <p className="text-2xl font-bold text-red-600">
            {entreprises.filter((e) => e.suspendedAt).length}
          </p>
        </div>
        <div className="card bg-gray-50">
          <p className="text-sm text-neutral mb-1">Inactives</p>
          <p className="text-2xl font-bold text-gray-600">
            {entreprises.filter((e) => !e.isActive && !e.suspendedAt).length}
          </p>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filtre statut */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives uniquement</option>
              <option value="suspended">Suspendues</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des entreprises */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-primary text-3xl" />
          </div>
        ) : entreprises.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-neutral">Aucune entreprise trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entreprises.map((entreprise) => (
                  <tr key={entreprise._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {entreprise.nom.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {entreprise.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entreprise.nombreEmployes} employés
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entreprise.email}</div>
                      <div className="text-xs text-gray-500">
                        Inscrit le {formatDate(entreprise.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {entreprise.stats?.contactRequests || 0} demandes
                      </div>
                      <div>{entreprise.stats?.devis || 0} devis</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entreprise.suspendedAt ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Suspendue
                        </span>
                      ) : entreprise.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {entreprise.suspendedAt ? (
                          <button
                            onClick={() => handleActivate(entreprise._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Réactiver"
                          >
                            <FaCheckCircle size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedEntreprise(entreprise);
                              setShowSuspendModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Suspendre"
                          >
                            <FaBan size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Modal Suspension */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-primary mb-4">
              Suspendre l'entreprise
            </h3>
            <p className="text-neutral mb-4">
              Vous êtes sur le point de suspendre{' '}
              <strong>{selectedEntreprise?.nom}</strong>
            </p>
            <textarea
              placeholder="Raison de la suspension (obligatoire)..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              rows="4"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspensionReason('');
                  setSelectedEntreprise(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSuspend}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirmer la suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEntreprises;