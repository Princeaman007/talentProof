import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaSave, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaBriefcase,
  FaImage 
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    secteurActivite: '',
    nombreEmployes: '',
    profilsRecherches: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Charger les données de l'utilisateur au montage du composant
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        secteurActivite: user.secteurActivite || '',
        nombreEmployes: user.nombreEmployes || '',
        profilsRecherches: Array.isArray(user.profilsRecherches) 
          ? user.profilsRecherches.join(', ') 
          : user.profilsRecherches || '',
        logo: user.logo || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Convertir profilsRecherches en tableau
    const dataToSend = {
      ...formData,
      profilsRecherches: formData.profilsRecherches
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== ''),
    };

    const result = await updateProfile(dataToSend);

    if (result.success) {
      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès !',
      });
    } else {
      setMessage({
        type: 'error',
        text: result.message || 'Erreur lors de la mise à jour',
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Mon Profil</h1>
        <p className="text-neutral mt-2">Modifiez les informations de votre entreprise</p>
      </div>

      {/* Form */}
      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message */}
          {message.text && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Nom entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBuilding className="inline mr-2" />
              Nom de l'entreprise *
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="input-field"
              placeholder="+32 123 45 67 89"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="input-field"
              placeholder="Rue, ville, code postal"
            />
          </div>

          {/* Secteur d'activité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBriefcase className="inline mr-2" />
              Secteur d'activité
            </label>
            <input
              type="text"
              name="secteurActivite"
              value={formData.secteurActivite}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: Technologies, Finance, Santé..."
            />
          </div>

          {/* Nombre d'employés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUsers className="inline mr-2" />
              Nombre d'employés
            </label>
            <select
              name="nombreEmployes"
              value={formData.nombreEmployes}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Sélectionner...</option>
              <option value="1-10">1-10 employés</option>
              <option value="11-50">11-50 employés</option>
              <option value="51-200">51-200 employés</option>
              <option value="201-500">201-500 employés</option>
              <option value="500+">500+ employés</option>
            </select>
          </div>

          {/* Profils recherchés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profils recherchés
            </label>
            <input
              type="text"
              name="profilsRecherches"
              value={formData.profilsRecherches}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: Développeur React, Backend Node.js, Full-stack..."
            />
            <p className="text-xs text-neutral mt-1">
              Séparez les profils par des virgules
            </p>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline mr-2" />
              URL du logo
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="input-field"
              placeholder="https://exemple.com/logo.png"
            />
            {formData.logo && (
              <div className="mt-3">
                <p className="text-xs text-neutral mb-2">Aperçu :</p>
                <img 
                  src={formData.logo} 
                  alt="Logo entreprise" 
                  className="w-24 h-24 object-contain border rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            <FaSave className="inline mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="card bg-blue-50 border border-blue-200 max-w-3xl">
        <p className="text-sm text-neutral">
          💡 <strong>Astuce :</strong> Vos informations sont utilisées pour personnaliser
          votre expérience et faciliter les échanges avec les talents.
        </p>
      </div>
    </div>
  );
};

export default Profile;