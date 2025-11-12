import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import AddTeamMemberModal from '../../components/modals/AddTeamMemberModal';
import EditTeamMemberModal from '../../components/modals/EditTeamMemberModal';

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team');
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
      showMessage('error', 'Erreur lors du chargement de l\'équipe');
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
    fetchMembers();
  };

  const handleEditSuccess = (msg) => {
    showMessage('success', msg);
    setShowEditModal(false);
    setSelectedMember(null);
    fetchMembers();
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return;
    }

    try {
      // ✅ CORRECTION : '/team' au lieu de '/admin/team'
      await api.delete(`/team/${id}`);
      showMessage('success', 'Membre supprimé avec succès');
      fetchMembers();
    } catch (error) {
      console.error('Erreur suppression:', error);
      showMessage('error', 'Erreur lors de la suppression');
    }
  };

  const filteredMembers = members.filter(member =>
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestion de l'Équipe</h1>
          <p className="text-neutral mt-2">
            {members.length} membre{members.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary whitespace-nowrap"
        >
          <FaPlus className="inline mr-2" />
          Ajouter un membre
        </button>
      </div>

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

      <div className="card">
        <div className="flex items-center gap-3">
          <FaSearch className="text-neutral" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-neutral mt-4">Chargement...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral text-lg">
            {searchTerm ? 'Aucun membre trouvé avec ces critères.' : 'Aucun membre ajouté pour le moment.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4"
            >
              <FaPlus className="inline mr-2" />
              Ajouter votre premier membre
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member._id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`${member.prenom} ${member.nom}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl">
                      {member.prenom?.charAt(0)}{member.nom?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-primary">
                      {member.prenom} {member.nom}
                    </h3>
                    <p className="text-sm text-secondary font-medium">{member.poste}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral mb-4 line-clamp-3 leading-relaxed">
                {member.bio}
              </p>

              <div className="flex items-center gap-3 mb-4">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-primary hover:text-primary-dark transition-colors" title={member.email}>
                    <FaEnvelope size={18} />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors" title="LinkedIn">
                    <FaLinkedin size={18} />
                  </a>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddTeamMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && selectedMember && (
        <EditTeamMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdminTeam;