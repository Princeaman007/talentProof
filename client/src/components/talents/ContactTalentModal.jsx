import { useState } from 'react';
import { FaTimes, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import api from '../../utils/api';

const ContactTalentModal = ({ talent, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    recruteurNom: '',
    recruteurEmail: '',
    recruteurTel: '',
    entreprise: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/talents/contact', {
        talentId: talent._id,
        ...formData,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Demande envoyée !</h2>
          <p className="text-neutral">
            Nous vous contacterons sous 24-48h avec les informations complètes sur ce talent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Demande de contact - {talent.prenom}
            </h2>
            <p className="text-sm text-neutral mt-1">
              Remplissez le formulaire pour recevoir les informations complètes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral hover:text-primary transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Info talent */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-primary mb-2">À propos de ce talent</h3>
            <div className="space-y-1 text-sm text-neutral">
              <p>
                <strong>Score :</strong> {talent.scoreTest}/100 ({talent.plateforme})
              </p>
              <p>
                <strong>Technologies :</strong> {talent.technologies?.join(', ')}
              </p>
              <p>
                <strong>Expérience :</strong> {talent.anneeExperience}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Votre nom complet *
              </label>
              <input
                type="text"
                name="recruteurNom"
                required
                value={formData.recruteurNom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Email professionnel *
              </label>
              <input
                type="email"
                name="recruteurEmail"
                required
                value={formData.recruteurEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="jean.dupont@entreprise.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="recruteurTel"
                required
                value={formData.recruteurTel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+32 123 456 789"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Entreprise *
              </label>
              <input
                type="text"
                name="entreprise"
                required
                value={formData.entreprise}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tech Solutions SARL"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Message / Besoins *
              </label>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Décrivez brièvement le poste et vos besoins..."
              ></textarea>
              <p className="text-xs text-neutral mt-1">Minimum 20 caractères</p>
            </div>

            {/* Boutons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-neutral rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Envoi...</span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Envoyer la demande</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactTalentModal;