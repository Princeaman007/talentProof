import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="bg-white p-3 rounded-lg">
                <FaCheckCircle className="text-primary text-3xl" />
              </div>
              <span className="text-3xl font-bold text-white">TalentProof</span>
            </Link>
          </div>

          {/* Message de succès */}
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full">
              <FaEnvelope className="text-success text-3xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-dark mb-4">
              Email envoyé !
            </h2>
            
            <p className="text-neutral mb-6">
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
            </p>

            <p className="text-sm text-neutral mb-6">
              Vérifiez votre boîte de réception et vos spams. Le lien est valide pendant 1 heure.
            </p>

            <Link
              to="/login"
              className="inline-block btn-primary"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="bg-white p-3 rounded-lg">
              <FaCheckCircle className="text-primary text-3xl" />
            </div>
            <span className="text-3xl font-bold text-white">TalentProof</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-gray-200">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="contact@exemple.com"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>

          {/* Liens retour */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/login"
              className="block text-sm text-neutral hover:text-primary font-semibold"
            >
              ← Retour à la connexion
            </Link>
            <p className="text-neutral text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-dark">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;