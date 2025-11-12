import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DevisForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const servicePreselect = location.state?.servicePreselect || '';

  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    // Étape 1 : Informations personnelles
    nomComplet: '',
    email: '',
    telephone: '',
    entreprise: '',

    // Étape 2 : Type de projet
    typeProjet: servicePreselect ? mapServiceToType(servicePreselect) : '',
    description: '',

    // Étape 3 : Fonctionnalités
    fonctionnalites: [],

    // Étape 4 : Budget et délais
    budgetEstime: '',
    delaiSouhaite: ''
  });

  function mapServiceToType(serviceName) {
    const mapping = {
      'Site Vitrine': 'site-vitrine',
      'Site E-commerce': 'site-e-commerce',
      'Application Web': 'application-web',
      'Application Mobile': 'application-mobile'
    };
    return mapping[serviceName] || '';
  }

  const typesProjet = [
    { value: 'site-vitrine', label: 'Site Vitrine', icon: '🌐', description: 'Site de présentation' },
    { value: 'site-e-commerce', label: 'Site E-commerce', icon: '🛒', description: 'Boutique en ligne' },
    { value: 'application-mobile', label: 'Application Mobile', icon: '📱', description: 'App iOS/Android' },
    { value: 'application-web', label: 'Application Web', icon: '💻', description: 'Plateforme web' },
    { value: 'refonte-site', label: 'Refonte de Site', icon: '🔄', description: 'Moderniser un site' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', description: 'Support technique' },
    { value: 'autre', label: 'Autre', icon: '✨', description: 'Projet spécifique' }
  ];

  const fonctionnalitesOptions = [
    'Formulaire de contact',
    'Blog/Actualités',
    'Espace membres',
    'Paiement en ligne',
    'Système de réservation',
    'Chat en direct',
    'Multilingue',
    'API/Intégrations',
    'Notifications push',
    'Géolocalisation',
    'Tableau de bord admin',
    'Gestion de contenu (CMS)'
  ];

  const budgetOptions = [
    { value: 'moins-5000', label: 'Moins de 5 000€' },
    { value: '5000-10000', label: '5 000€ - 10 000€' },
    { value: '10000-20000', label: '10 000€ - 20 000€' },
    { value: '20000-50000', label: '20 000€ - 50 000€' },
    { value: 'plus-50000', label: 'Plus de 50 000€' },
    { value: 'a-discuter', label: 'À discuter' }
  ];

  const delaiOptions = [
    { value: 'urgent', label: 'Urgent (< 1 mois)', icon: '🔥' },
    { value: 'court-terme', label: 'Court terme (1-2 mois)', icon: '⚡' },
    { value: 'moyen-terme', label: 'Moyen terme (3-6 mois)', icon: '📅' },
    { value: 'long-terme', label: 'Long terme (> 6 mois)', icon: '🎯' },
    { value: 'flexible', label: 'Flexible', icon: '🤝' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFonctionnaliteToggle = (fonc) => {
    setFormData(prev => ({
      ...prev,
      fonctionnalites: prev.fonctionnalites.includes(fonc)
        ? prev.fonctionnalites.filter(f => f !== fonc)
        : [...prev.fonctionnalites, fonc]
    }));
  };

  const etapeSuivante = () => {
    // Validation selon l'étape
    if (etapeActuelle === 1) {
      if (!formData.nomComplet || !formData.email || !formData.telephone) {
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
        return;
      }
    }
    if (etapeActuelle === 2) {
      if (!formData.typeProjet || !formData.description) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner un type de projet et décrire votre besoin' });
        return;
      }
    }

    setMessage({ type: '', text: '' });
    setEtapeActuelle(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const etapePrecedente = () => {
    setEtapeActuelle(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.budgetEstime || !formData.delaiSouhaite) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un budget et un délai' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/devis', formData);
      
      setMessage({ 
        type: 'success', 
        text: response.data.message 
      });

      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Erreur envoi devis:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Indicateur de progression
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4].map((etape) => (
          <div key={etape} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              etape <= etapeActuelle 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {etape}
            </div>
            {etape < 4 && (
              <div className={`flex-1 h-1 mx-2 ${
                etape < etapeActuelle 
                  ? 'bg-primary' 
                  : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Coordonnées</span>
        <span>Projet</span>
        <span>Fonctionnalités</span>
        <span>Budget</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Demande de Devis
          </h1>
          <p className="text-lg text-slate-600">
            Décrivez votre projet en quelques étapes
          </p>
        </div>

        {/* Barre de progression */}
        <ProgressBar />

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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* ÉTAPE 1 : Informations personnelles */}
          {etapeActuelle === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Vos coordonnées
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomComplet"
                  value={formData.nomComplet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+32 4XX XX XX XX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Entreprise (optionnel)
                </label>
                <input
                  type="text"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={etapeSuivante}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Type de projet */}
          {etapeActuelle === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Quel type de projet ?
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {typesProjet.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, typeProjet: type.value }))}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.typeProjet === type.value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-sm text-slate-900">{type.label}</div>
                    <div className="text-xs text-slate-600">{type.description}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Décrivez votre projet <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Expliquez-nous votre projet, vos objectifs, votre cible..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={etapePrecedente}
                  className="bg-gray-200 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={etapeSuivante}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Fonctionnalités */}
          {etapeActuelle === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Fonctionnalités souhaitées
              </h2>

              <p className="text-slate-600 mb-4">
                Sélectionnez les fonctionnalités dont vous avez besoin (optionnel)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fonctionnalitesOptions.map((fonc) => (
                  <label
                    key={fonc}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.fonctionnalites.includes(fonc)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.fonctionnalites.includes(fonc)}
                      onChange={() => handleFonctionnaliteToggle(fonc)}
                      className="mr-3 w-5 h-5 text-primary"
                    />
                    <span className="text-slate-900 font-medium">{fonc}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={etapePrecedente}
                  className="bg-gray-200 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={etapeSuivante}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Budget et délais */}
          {etapeActuelle === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Budget et délais
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Budget estimé <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {budgetOptions.map((budget) => (
                    <label
                      key={budget.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.budgetEstime === budget.value
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="budgetEstime"
                        value={budget.value}
                        checked={formData.budgetEstime === budget.value}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5 text-primary"
                      />
                      <span className="text-slate-900 font-medium">{budget.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Délai souhaité <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {delaiOptions.map((delai) => (
                    <label
                      key={delai.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.delaiSouhaite === delai.value
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delaiSouhaite"
                        value={delai.value}
                        checked={formData.delaiSouhaite === delai.value}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5 text-primary"
                      />
                      <div>
                        <span className="text-2xl mr-2">{delai.icon}</span>
                        <span className="text-slate-900 font-medium">{delai.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={etapePrecedente}
                  className="bg-gray-200 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer la demande 🚀'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Informations de contact */}
        <div className="mt-8 text-center text-slate-600">
          <p className="mb-2">Une question ? Contactez-nous directement :</p>
          <div className="flex justify-center gap-6">
            <a href="mailto:info@princeaman.dev" className="hover:text-primary">
              📧 info@princeaman.dev
            </a>
            <a href="tel:+32467620878" className="hover:text-primary">
              📱 +32 467 62 08 78
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisForm;