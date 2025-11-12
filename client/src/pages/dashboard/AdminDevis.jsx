import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDevis = () => {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('');
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDevis();
    fetchStats();
  }, [filtreStatut]);

  const fetchDevis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = filtreStatut ? { statut: filtreStatut } : {};
      const response = await axios.get('/api/admin/devis', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setDevis(response.data.data);
    } catch (error) {
      console.error('Erreur chargement devis:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des devis' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/devis/stats/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const openModal = (devisItem) => {
    setSelectedDevis(devisItem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDevis(null);
  };

  const handleUpdateStatut = async (id, nouveauStatut) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/devis/${id}`, 
        { statut: nouveauStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Statut mis à jour' });
      fetchDevis();
      fetchStats();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleUpdatePriorite = async (id, nouvellePriorite) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/devis/${id}`, 
        { priorite: nouvellePriorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Priorité mise à jour' });
      fetchDevis();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/devis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Devis supprimé' });
      fetchDevis();
      fetchStats();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'nouveau': 'bg-blue-100 text-blue-800',
      'en-cours': 'bg-yellow-100 text-yellow-800',
      'devis-envoye': 'bg-purple-100 text-purple-800',
      'accepte': 'bg-green-100 text-green-800',
      'refuse': 'bg-red-100 text-red-800',
      'archive': 'bg-gray-100 text-gray-800'
    };
    return badges[statut] || 'bg-gray-100 text-gray-800';
  };

  const getPrioriteBadge = (priorite) => {
    const badges = {
      'basse': 'bg-slate-100 text-slate-700',
      'normale': 'bg-blue-100 text-blue-700',
      'haute': 'bg-orange-100 text-orange-700',
      'urgente': 'bg-red-100 text-red-700'
    };
    return badges[priorite] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBudgetLabel = (budget) => {
    const labels = {
      'moins-5000': 'Moins de 5 000€',
      '5000-10000': '5 000€ - 10 000€',
      '10000-20000': '10 000€ - 20 000€',
      '20000-50000': '20 000€ - 50 000€',
      'plus-50000': 'Plus de 50 000€',
      'a-discuter': 'À discuter'
    };
    return labels[budget] || budget;
  };

  const getDelaiLabel = (delai) => {
    const labels = {
      'urgent': 'Urgent (< 1 mois)',
      'court-terme': 'Court terme (1-2 mois)',
      'moyen-terme': 'Moyen terme (3-6 mois)',
      'long-terme': 'Long terme (> 6 mois)',
      'flexible': 'Flexible'
    };
    return labels[delai] || delai;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Devis</h1>
        <p className="text-slate-600 mt-1">Gérez les demandes de devis des clients</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-primary">{stats.totalDevis}</div>
            <div className="text-sm text-slate-600">Total devis</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.nouveaux}</div>
            <div className="text-sm text-slate-600">Nouveaux</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.enCours}</div>
            <div className="text-sm text-slate-600">En cours</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.acceptes}</div>
            <div className="text-sm text-slate-600">Acceptés</div>
          </div>
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltreStatut('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtreStatut === '' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFiltreStatut('nouveau')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtreStatut === 'nouveau' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            Nouveaux
          </button>
          <button
            onClick={() => setFiltreStatut('en-cours')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtreStatut === 'en-cours' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFiltreStatut('devis-envoye')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtreStatut === 'devis-envoye' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            Devis envoyé
          </button>
          <button
            onClick={() => setFiltreStatut('accepte')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtreStatut === 'accepte' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            Acceptés
          </button>
        </div>
      </div>

      {/* Liste des devis */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : devis.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-slate-600 text-lg">Aucun devis pour ce filtre</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Type de projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {devis.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.nomComplet}</div>
                      <div className="text-sm text-slate-500">{item.email}</div>
                      <div className="text-sm text-slate-500">{item.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.typeProjet}</div>
                      {item.entreprise && (
                        <div className="text-xs text-slate-500">{item.entreprise}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{getBudgetLabel(item.budgetEstime)}</div>
                      <div className="text-xs text-slate-500">{getDelaiLabel(item.delaiSouhaite)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.statut}
                        onChange={(e) => handleUpdateStatut(item._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatutBadge(item.statut)}`}
                      >
                        <option value="nouveau">Nouveau</option>
                        <option value="en-cours">En cours</option>
                        <option value="devis-envoye">Devis envoyé</option>
                        <option value="accepte">Accepté</option>
                        <option value="refuse">Refusé</option>
                        <option value="archive">Archivé</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.priorite}
                        onChange={(e) => handleUpdatePriorite(item._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getPrioriteBadge(item.priorite)}`}
                      >
                        <option value="basse">Basse</option>
                        <option value="normale">Normale</option>
                        <option value="haute">Haute</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openModal(item)}
                        className="text-primary hover:text-blue-900 font-medium mr-3"
                      >
                        Voir détails
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showModal && selectedDevis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Détails du Devis
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations client */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-3">Informations Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Nom complet</p>
                    <p className="font-medium">{selectedDevis.nomComplet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium">{selectedDevis.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Téléphone</p>
                    <p className="font-medium">{selectedDevis.telephone}</p>
                  </div>
                  {selectedDevis.entreprise && (
                    <div>
                      <p className="text-sm text-slate-600">Entreprise</p>
                      <p className="font-medium">{selectedDevis.entreprise}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Détails du projet */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-3">Détails du Projet</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Type de projet</p>
                    <p className="font-medium">{selectedDevis.typeProjet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Description</p>
                    <p className="text-slate-900">{selectedDevis.description}</p>
                  </div>
                  {selectedDevis.fonctionnalites.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Fonctionnalités souhaitées</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDevis.fonctionnalites.map((fonc, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {fonc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Budget estimé</p>
                      <p className="font-medium">{getBudgetLabel(selectedDevis.budgetEstime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Délai souhaité</p>
                      <p className="font-medium">{getDelaiLabel(selectedDevis.delaiSouhaite)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations système */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-3">Informations</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Reçu le</p>
                    <p className="font-medium">{formatDate(selectedDevis.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Dernière mise à jour</p>
                    <p className="font-medium">{formatDate(selectedDevis.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatutBadge(selectedDevis.statut)}`}>
                      {selectedDevis.statut}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-600">Priorité</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPrioriteBadge(selectedDevis.priorite)}`}>
                      {selectedDevis.priorite}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedDevis.email}`}
                  className="flex-1 bg-primary text-white text-center py-3 rounded-lg hover:bg-blue-900 transition-colors font-semibold"
                >
                  📧 Envoyer un email
                </a>
                <a
                  href={`tel:${selectedDevis.telephone}`}
                  className="flex-1 bg-accent text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  📱 Appeler
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDevis;