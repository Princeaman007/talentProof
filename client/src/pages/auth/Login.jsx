import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
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
          <h2 className="mt-6 text-2xl font-bold text-white">Connexion</h2>
          <p className="mt-2 text-gray-200">Accédez à votre espace entreprise</p>
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
                Email
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

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-1">
                Mot de passe
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
            </div>

            {/* Mot de passe oublié */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark font-semibold"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <p className="text-neutral">
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

export default Login;