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
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
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
      setLogoPreview(user.logo || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setMessage({
          type: 'error',
          text: 'Veuillez sélectionner une image valide',
        });
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'L\'image ne doit pas dépasser 5 Mo',
        });
        return;
      }

      setLogoFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData({ ...formData, logo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Utiliser FormData pour envoyer le fichier
      const submitData = new FormData();
      
      submitData.append('nom', formData.nom);
      submitData.append('email', formData.email);
      submitData.append('telephone', formData.telephone || '');
      submitData.append('adresse', formData.adresse || '');
      submitData.append('secteurActivite', formData.secteurActivite || '');
      submitData.append('nombreEmployes', formData.nombreEmployes);
      
      // Convertir profilsRecherches en tableau
      const profilsArray = formData.profilsRecherches
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      submitData.append('profilsRecherches', JSON.stringify(profilsArray));

      // Ajouter le fichier logo s'il existe
      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      // Envoyer avec axios (qui gère automatiquement multipart/form-data)
      const response = await updateProfile(submitData);

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Profil mis à jour avec succès !',
        });
        // Réinitialiser le fichier après succès
        setLogoFile(null);
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Erreur lors de la mise à jour',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors de la mise à jour du profil',
      });
    } finally {
      setLoading(false);
    }
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

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline mr-2" />
              Logo de l'entreprise
            </label>
            
            {/* Aperçu du logo */}
            {logoPreview && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={logoPreview} 
                  alt="Logo entreprise" 
                  className="w-32 h-32 object-contain border-2 border-gray-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  title="Supprimer le logo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Input de fichier */}
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-blue-800
                  file:cursor-pointer cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG ou GIF (max. 5 Mo)
              </p>
            </div>
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
           <strong>Astuce :</strong> Vos informations sont utilisées pour personnaliser
          votre expérience et faciliter les échanges avec les talents.
        </p>
      </div>
    </div>
  );
};

export default Profile;