import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSpinner } from 'react-icons/fa';
import talentDayService from '../../services/talentDayService';
import CreateTalentDay from '../../components/modals/CreateTalentDay';
import TalentDayInscriptions from '../../components/admin/TalentDayInscriptions';
import { toast } from 'react-toastify';
import { toastConfirm } from '../../utils/toastConfirm.jsx';

const AdminTalentDays = () => {
  const [talentDays, setTalentDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTalentDay, setSelectedTalentDay] = useState(null);
  
  //  NOUVEAUX ÉTATS POUR LES INSCRIPTIONS
  const [showInscriptions, setShowInscriptions] = useState(false);
  const [selectedTalentDayId, setSelectedTalentDayId] = useState(null);

  // Fetch TalentDays
  const fetchTalentDays = async () => {
    try {
      setLoading(true);
      const response = await talentDayService.getAllTalentDaysAdmin();
      if (response.data?.success) {
        setTalentDays(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalentDays();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    toastConfirm(
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      async () => {
        try {
          const response = await talentDayService.deleteTalentDay(id);
          if (response.data?.success) {
            setTalentDays(talentDays.filter(td => td._id !== id));
            toast.success('Événement supprimé avec succès');
          }
        } catch (err) {
          toast.error('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  // Handle create/update success
  const handleSaveSuccess = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setSelectedTalentDay(null);
    fetchTalentDays();
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (statut) => {
    const colors = {
      'a-venir': 'bg-gray-100 text-gray-800',
      'inscriptions-ouvertes': 'bg-green-100 text-green-800',
      'complet': 'bg-orange-100 text-orange-800',
      'en-cours': 'bg-blue-100 text-blue-800',
      'termine': 'bg-purple-100 text-purple-800',
      'annule': 'bg-red-100 text-red-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Talent Days</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setSelectedTalentDay(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          <FaPlus /> Créer un événement
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {talentDays.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Aucun événement créé pour le moment</p>
          <p className="text-sm mt-2">Cliquez sur "Créer un événement" pour en créer un</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Places</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inscriptions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {talentDays.map((talentDay) => (
                <tr key={talentDay._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{talentDay.titre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(talentDay.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{talentDay.typeEvenement}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(talentDay.statut)}`}>
                      {talentDay.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {talentDay.placesRestantes}/{talentDay.placesDisponibles}
                  </td>
                  
                  {/*  NOUVELLE COLONNE INSCRIPTIONS */}
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedTalentDayId(talentDay._id);
                        setShowInscriptions(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                    >
                      <FaUsers />
                      {talentDay.inscriptions?.length || 0}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedTalentDay(talentDay);
                          setEditingId(talentDay._id);
                          setShowCreateModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(talentDay._id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateTalentDay
          talentDay={selectedTalentDay}
          isEditing={!!editingId}
          onClose={() => {
            setShowCreateModal(false);
            setEditingId(null);
            setSelectedTalentDay(null);
          }}
          onSuccess={handleSaveSuccess}
        />
      )}

      {/*  MODAL INSCRIPTIONS */}
      {showInscriptions && (
        <TalentDayInscriptions
          talentDayId={selectedTalentDayId}
          onClose={() => {
            setShowInscriptions(false);
            setSelectedTalentDayId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTalentDays;