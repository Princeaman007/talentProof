import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { COMPANY_SIZES } from '../../utils/constants';
import ErrorMessage, { FieldError } from '../../components/ErrorMessage';
import { extractErrorMessage } from '../../utils/errorHandler';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombreEmployes: '1-10',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Au moins un caractère spécial (!@#$%^&*...)');
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'entreprise est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(', ');
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!validateForm()) return;
    
    setError(null);
    setLoading(true);

    try {
      const result = await register({
        nom: formData.nom,
        email: formData.email,
        password: formData.password,
        nombreEmployes: formData.nombreEmployes,
      });

      if (result.success) {
        navigate('/email-confirmation');
      } else {
        // Afficher l'erreur retournée par le backend
        setError(result.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      // Erreur réseau ou autre problème inattendu
      const message = extractErrorMessage(err, 'Erreur de connexion. Veuillez réessayer.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-4 py-10">
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
            <ErrorMessage message={error} onClose={() => setError(null)} />
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tech Solutions"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
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
              
              {/* Critères de validation */}
              <div className="mt-2 space-y-1">
                <p className="text-xs font-semibold text-neutral-dark">Le mot de passe doit contenir :</p>
                <ul className="text-xs space-y-0.5">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    {formData.password.length >= 8 ? '' : '○'} Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[A-Z]/.test(formData.password) ? '' : '○'} Au moins une majuscule
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[a-z]/.test(formData.password) ? '' : '○'} Au moins une minuscule
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[0-9]/.test(formData.password) ? '' : '○'} Au moins un chiffre
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '' : '○'} Au moins un caractère spécial (!@#$%...)
                  </li>
                </ul>
              </div>
              
              {errors.password && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-semibold">Mot de passe invalide :</p>
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                </div>
              )}
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
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