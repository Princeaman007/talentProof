import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const TalentDayRegister = () => {
  const { id } = useParams();
  
  const [talentDay, setTalentDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    motivation: '',
  });

  useEffect(() => {
    const fetchTalentDay = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/talent-days/${id}`);
        if (response.data.success) {
          const td = response.data.data;
          
          // Ensure placesRestantes is properly set
          const placesRestantes = td.placesRestantes || td.placesDisponibles || 0;
          
          // Vérifier si les inscriptions sont ouvertes
          if (td.statut !== 'inscriptions-ouvertes' || placesRestantes === 0) {
            setError('Les inscriptions sont fermées pour cet événement');
          }
          
          setTalentDay(td);
        }
      } catch (err) {
        console.error('Erreur récupération TalentDay:', err);
        setError('Événement non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchTalentDay();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/talent-days/${id}/register`,
        formData
      );

      if (response.data.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Inscription confirmée ! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Votre inscription à <strong>{talentDay?.titre}</strong> a été enregistrée avec succès.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-2">Prochaines étapes :</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Vous recevrez un email de confirmation avec tous les détails</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Notre équipe examinera votre candidature</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Vous serez notifié de l'acceptation sous 48h</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/talent-days/${id}`}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Voir les détails de l'événement
            </Link>
            <Link
              to="/talent-days"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Autres événements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!talentDay || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription impossible</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Une erreur est survenue'}
          </p>
          <Link
            to="/talent-days"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Bouton retour */}
          <Link
            to={`/talent-days/${id}`}
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux détails
          </Link>

          {/* Carte d'inscription */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-700 text-white p-8">
              <h1 className="text-3xl font-bold mb-2">Inscription</h1>
              <p className="text-xl text-blue-100">{talentDay.titre}</p>
            </div>

            {/* Formulaire */}
            <div className="p-8">
              {/* Info places restantes */}
              <div className="bg-orange-50 border-l-4 border-secondary rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Places restantes : {talentDay.placesRestantes}</strong> sur {talentDay.placesDisponibles}
                  <br />
                  Ne tardez pas à vous inscrire !
                </p>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom complet */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Votre nom et prénom"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="votre.email@exemple.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nous vous enverrons une confirmation à cette adresse
                  </p>
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+32 xxx xx xx xx"
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
                    Pourquoi souhaitez-vous participer ? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Expliquez-nous votre motivation, vos compétences et ce que vous espérez tirer de cet événement..."
                    minLength="50"
                    maxLength="1000"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.motivation.length}/1000 caractères (minimum 50)
                  </p>
                </div>

                {/* Conditions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    En vous inscrivant, vous acceptez de :
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>Participer activement à l'événement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>Respecter les règles et l'organisation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>Autoriser TalentProof à partager vos résultats avec les entreprises partenaires</span>
                    </li>
                  </ul>
                </div>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-secondary to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      ✓ Confirmer mon inscription
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Une question ? Contactez-nous à{' '}
              <a href="mailto:info@princeaman.dev" className="text-primary hover:underline">
                info@princeaman.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDayRegister;