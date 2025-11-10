import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { COMPANY_SIZES } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombreEmployes: '1-10',
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const result = await register({
      nom: formData.nom,
      email: formData.email,
      password: formData.password,
      nombreEmployes: formData.nombreEmployes,
    });

    setLoading(false);

    if (result.success) {
      navigate('/email-confirmation');
    } else {
      setError(result.message);
    }
  };

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
          <h2 className="mt-6 text-2xl font-bold text-white">Créer un compte entreprise</h2>
          <p className="mt-2 text-gray-200">Accédez aux meilleurs talents tech</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom entreprise */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tech Solutions"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Email professionnel *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="contact@exemple.com"
              />
            </div>

            {/* Taille entreprise */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Nombre d'employés
              </label>
              <select
                name="nombreEmployes"
                value={formData.nombreEmployes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employés
                  </option>
                ))}
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-neutral mt-1">Minimum 6 caractères</p>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-neutral">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;