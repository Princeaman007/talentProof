import { useState } from 'react';
import api from '../../utils/api';
import { FaTimes, FaSave } from 'react-icons/fa';

const AddTeamMemberModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    poste: '',
    bio: '',
    email: '',
    linkedin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    
    await api.post('/team', formData);
    onSuccess('Membre ajouté avec succès !');
  } catch (error) {
    console.error('Erreur ajout:', error);
    setError(error.response?.data?.message || 'Erreur lors de l\'ajout');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">Ajouter un membre</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Poste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poste *
            </label>
            <input
              type="text"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: CEO, CTO, Responsable Talent..."
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Expérience et expertise du membre..."
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="exemple@talentproof.com"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profil LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="input-field"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              <FaSave className="inline mr-2" />
              {loading ? 'Enregistrement...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;