import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Phone, Globe, FileText, Calendar, CheckCircle } from 'lucide-react';
import apiService from '../services/api';
import ErrorMessage, { SuccessMessage, FieldError } from '../components/ErrorMessage';
import { formatDate } from '../utils/formatters';
import { validateEmail, validatePhone, validateName } from '../utils/validators';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [talentDays, setTalentDays] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    interestedTalentDays: [],
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [apiErrorDetails, setApiErrorDetails] = useState(null);

  useEffect(() => {
    fetchTalentDays();
  }, []);

  const fetchTalentDays = async () => {
    try {
      const response = await apiService.talentDays.getAll({ statut: 'inscriptions-ouvertes' });
      if (response.success) {
        setTalentDays(response.data);
      }
    } catch (error) {
      const message = error?.error?.message || error?.message || 'Erreur de chargement';
      setApiError(message);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation nom entreprise
    const companyNameValidation = validateName(formData.companyName, 'nom de l\'entreprise');
    if (!companyNameValidation.valid) {
      newErrors.companyName = companyNameValidation.error;
    }

    // Validation contact
    const contactValidation = validateName(formData.contactPerson, 'nom du contact');
    if (!contactValidation.valid) {
      newErrors.contactPerson = contactValidation.error;
    }

    // Validation email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    // Validation téléphone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.error;
    }

    // Validation TalentDays
    if (formData.interestedTalentDays.length === 0) {
      newErrors.interestedTalentDays = 'Sélectionnez au moins un TalentDay';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTalentDayChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      interestedTalentDays: selected,
    }));
    if (errors.interestedTalentDays) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.interestedTalentDays;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Reset error states
    setApiError(null);
    setApiErrorDetails(null);
    setErrors({});

    try {
      setLoading(true);
      const response = await apiService.companies.register(formData);
      // L'interceptor retourne déjà response.data
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/talent-days');
        }, 3000);
      } else {
        setApiError(response.message || 'Erreur lors de l\'inscription');
        setApiErrorDetails(response.details);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      // L'interceptor formate déjà l'erreur
      const message = error?.error?.message || error?.message || 'Erreur de connexion. Veuillez réessayer.';
      const details = error?.error?.details || null;
      setApiError(message);
      setApiErrorDetails(details);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Inscription envoyée avec succès !
          </h2>
          <p className="text-gray-600 mb-4">
            Merci pour votre intérêt pour les TalentDays !
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900 font-semibold mb-2"> Email de confirmation envoyé</p>
            <p className="text-blue-700 text-sm">
              Notre équipe examinera votre demande et vous contactera sous 48 heures.
            </p>
          </div>
          <div className="space-y-2 text-left">
            <p className="text-gray-700"> Validation de votre inscription par notre équipe</p>
            <p className="text-gray-700"> Réception d'un email de confirmation</p>
            <p className="text-gray-700"> Accès à la liste des talents participants</p>
            <p className="text-gray-700"> Possibilité de réserver des meetings individuels</p>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Redirection automatique dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inscription Entreprise
          </h1>
          <p className="text-lg text-gray-600">
            Participez aux TalentDays et rencontrez les meilleurs talents
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <ErrorMessage 
            message={apiError} 
            details={apiErrorDetails}
            onClose={() => {
              setApiError(null);
              setApiErrorDetails(null);
            }}
          />
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="inline w-4 h-4 mr-1" />
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.companyName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="Ex: TechCorp SAS"
                aria-label="Nom de l'entreprise"
                aria-invalid={errors.companyName ? 'true' : 'false'}
              />
              <FieldError error={errors.companyName} />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Personne de contact *
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contactPerson ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
                placeholder="Nom et prénom"
                aria-label="Personne de contact"
                aria-invalid={errors.contactPerson ? 'true' : 'false'}
              />
              <FieldError error={errors.contactPerson} />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
                  placeholder="contact@entreprise.com"
                  aria-label="Email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                  <FieldError error={errors.email} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[\d\s+()-]{9,20}"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                  }`}
                  placeholder="+32 XXX XX XX XX"
                  aria-label="Téléphone"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                  <FieldError error={errors.phone} />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://www.entreprise.com"
              />
            </div>

            {/* Interested TalentDays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                TalentDays d'intérêt * (maintenez Ctrl/Cmd pour sélectionner plusieurs)
              </label>
              <select
                multiple
                onChange={handleTalentDayChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 min-h-[120px] ${
                  errors.interestedTalentDays ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary/30'
                }`}
              >
                {talentDays.map(td => (
                  <option key={td._id} value={td._id}>
                    {td.titre} - {new Date(td.date).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
              <FieldError error={errors.interestedTalentDays} />
              <p className="text-xs text-gray-500 mt-1">
                {formData.interestedTalentDays.length} événement(s) sélectionné(s)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Notes ou commentaires
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Parlez-nous de vos besoins, profils recherchés, etc."
                maxLength="1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.notes.length}/1000 caractères
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer mon inscription'
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              * Champs obligatoires
            </p>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3"> Après votre inscription :</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li> Notre équipe valide votre demande (sous 48h)</li>
            <li> Vous recevez un email de confirmation</li>
            <li> Vous accédez à la liste des talents participants</li>
            <li> Vous pouvez réserver des meetings individuels</li>
            <li> Vous participez aux événements sélectionnés</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
