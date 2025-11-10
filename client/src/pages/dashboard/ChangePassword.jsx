import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);

    const result = await changePassword(formData.currentPassword, formData.newPassword);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Changer le mot de passe</h1>
        <p className="text-neutral mt-2">Mettez à jour votre mot de passe</p>
      </div>

      <div className="card">
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <FaCheckCircle className="mr-2" />
            Mot de passe modifié avec succès !
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mot de passe actuel */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Mot de passe actuel *
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
              >
                {showPasswords ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Nouveau mot de passe *
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-neutral mt-1">Minimum 6 caractères</p>
          </div>

          {/* Confirmer nouveau mot de passe */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Conseils de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2">🔐 Conseils de sécurité</h3>
            <ul className="text-sm text-neutral space-y-1">
              <li>• Utilisez au moins 6 caractères</li>
              <li>• Combinez majuscules, minuscules et chiffres</li>
              <li>• Évitez les mots courants ou dates de naissance</li>
              <li>• Ne réutilisez pas un ancien mot de passe</li>
            </ul>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaLock />
            <span>{loading ? 'Modification...' : 'Changer le mot de passe'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;