import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import AddTalentModal from '../../components/modals/AddTalentModal';
import EditTalentModal from '../../components/modals/EditTalentModal';

const AdminTalents = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/talents');
      setTalents(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement talents:', error);
      showMessage('error', 'Erreur lors du chargement des talents');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAddSuccess = (msg) => {
    showMessage('success', msg);
    setShowAddModal(false);
    fetchTalents();
  };

  const handleEditSuccess = (msg) => {
    showMessage('success', msg);
    setShowEditModal(false);
    setSelectedTalent(null);
    fetchTalents();
  };

  const handleEdit = (talent) => {
    setSelectedTalent(talent);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce talent ?')) {
      return;
    }

    try {
      await api.delete(`/admin/talents/${id}`);
      showMessage('success', 'Talent supprimé avec succès');
      fetchTalents();
    } catch (error) {
      console.error('Erreur suppression:', error);
      showMessage('error', 'Erreur lors de la suppression');
    }
  };

  const filteredTalents = talents.filter(talent =>
    talent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
    talent.typeProfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutBadge = (statut) => {
    const colors = {
      actif: 'bg-green-100 text-green-700',
      inactif: 'bg-gray-100 text-gray-700',
      en_mission: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      actif: 'Actif',
      inactif: 'Inactif',
      en_mission: 'En mission',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${colors[statut] || colors.actif}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestion des Talents</h1>
          <p className="text-neutral mt-2">
            {talents.length} talent{talents.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary whitespace-nowrap"
        >
          <FaPlus className="inline mr-2" />
          Ajouter un talent
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-3">
          <FaSearch className="text-neutral" />
          <input
            type="text"
            placeholder="Rechercher par prénom, technologie ou profil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
      </div>

      {/* Liste des talents */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-neutral mt-4">Chargement...</p>
        </div>
      ) : filteredTalents.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral text-lg">
            {searchTerm ? 'Aucun talent trouvé avec ces critères.' : 'Aucun talent ajouté pour le moment.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4"
            >
              <FaPlus className="inline mr-2" />
              Ajouter votre premier talent
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700">Talent</th>
                <th className="text-left p-4 font-semibold text-gray-700">Profil</th>
                <th className="text-left p-4 font-semibold text-gray-700">Niveau</th>
                <th className="text-left p-4 font-semibold text-gray-700">Contrat</th>
                <th className="text-left p-4 font-semibold text-gray-700">Technologies</th>
                <th className="text-left p-4 font-semibold text-gray-700">Score</th>
                <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalents.map((talent) => (
                <tr key={talent._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {talent.photo ? (
                        <img
                          src={talent.photo}
                          alt={talent.prenom}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {talent.prenom?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{talent.prenom}</p>
                        <p className="text-xs text-neutral">
                          {talent.anneesExperience === 0
                            ? 'Débutant'
                            : `${talent.anneesExperience} an${talent.anneesExperience > 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {talent.typeProfil}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {talent.niveau}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-neutral">{talent.typeContrat}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {talent.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                      {talent.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{talent.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-secondary">{talent.scoreTest}</span>
                      <span className="text-xs text-neutral">/100</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatutBadge(talent.statut)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(talent)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(talent._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modals */}
      {showAddModal && (
        <AddTalentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && selectedTalent && (
        <EditTalentModal
          talent={selectedTalent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTalent(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdminTalents;