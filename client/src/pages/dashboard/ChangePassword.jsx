import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimes, FaCheck } from 'react-icons/fa';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation en temps réel
  useEffect(() => {
    validatePasswords();
  }, [formData]);

  const calculatePasswordStrength = (password) => {
    if (!password) return '';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'faible';
    if (strength <= 3) return 'moyen';
    return 'fort';
  };

  const validatePasswords = () => {
    const newErrors = {};

    // Validation nouveau mot de passe
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPasswordUppercase = 'Au moins une majuscule requise';
      }
      if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPasswordNumber = 'Au moins un chiffre requis';
      }
      if (formData.currentPassword && formData.currentPassword === formData.newPassword) {
        newErrors.newPasswordSame = 'Le nouveau mot de passe doit être différent de l\'ancien';
      }

      // Calcul de la force
      const strength = calculatePasswordStrength(formData.newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength('');
    }

    // Validation confirmation
    if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess(false);
  };

  const isFormValid = () => {
    return (
      formData.currentPassword &&
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 6 &&
      /[A-Z]/.test(formData.newPassword) &&
      /[0-9]/.test(formData.newPassword) &&
      formData.currentPassword !== formData.newPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validatePasswords()) {
      setError('Veuillez corriger les erreurs avant de continuer');
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
      setPasswordStrength('');
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.message || 'Le mot de passe actuel est incorrect');
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10 ${
                  error && error.includes('actuel') ? 'border-red-500' : 'border-gray-300'
                }`}
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
            {error && error.includes('actuel') && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <FaTimes className="mr-1" />
                <span>{error}</span>
              </div>
            )}
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                Object.keys(errors).some(key => key.startsWith('newPassword')) ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            
            {/* Indicateur de force */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-dark">Force du mot de passe :</span>
                  <span className={`text-xs font-bold ${
                    passwordStrength === 'faible' ? 'text-red-600' :
                    passwordStrength === 'moyen' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength === 'faible' ? 'w-1/3 bg-red-500' :
                      passwordStrength === 'moyen' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Critères de validation */}
            <div className="mt-3 space-y-1.5">
              <div className={`flex items-center text-sm ${
                formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {formData.newPassword.length >= 6 ? <FaCheck className="mr-2" /> : <span className="mr-2">○</span>}
                Au moins 6 caractères
              </div>
              <div className={`flex items-center text-sm ${
                /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'
              }`}>
                {/[A-Z]/.test(formData.newPassword) ? <FaCheck className="mr-2" /> : <span className="mr-2">○</span>}
                Au moins une majuscule
              </div>
              <div className={`flex items-center text-sm ${
                /[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'
              }`}>
                {/[0-9]/.test(formData.newPassword) ? <FaCheck className="mr-2" /> : <span className="mr-2">○</span>}
                Au moins un chiffre
              </div>
              <div className={`flex items-center text-sm ${
                formData.currentPassword && formData.newPassword && formData.currentPassword !== formData.newPassword ? 'text-green-600' : 'text-gray-500'
              }`}>
                {formData.currentPassword && formData.newPassword && formData.currentPassword !== formData.newPassword ? <FaCheck className="mr-2" /> : <span className="mr-2">○</span>}
                Différent du mot de passe actuel
              </div>
            </div>

            {/* Messages d'erreur détaillés */}
            {Object.keys(errors).some(key => key.startsWith('newPassword')) && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-600 mb-1">Erreurs détectées :</p>
                <ul className="text-xs text-red-600 space-y-0.5">
                  {errors.newPassword && <li>• {errors.newPassword}</li>}
                  {errors.newPasswordUppercase && <li>• {errors.newPasswordUppercase}</li>}
                  {errors.newPasswordNumber && <li>• {errors.newPasswordNumber}</li>}
                  {errors.newPasswordSame && <li>• {errors.newPasswordSame}</li>}
                </ul>
              </div>
            )}
          </div>

          {/* Confirmer nouveau mot de passe */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10 ${
                  errors.confirmPassword ? 'border-red-500' : 
                  formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'border-green-500' : 
                  'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" />
              )}
            </div>
            
            {/* Message de confirmation */}
            {formData.confirmPassword && (
              <div className={`mt-2 flex items-center text-sm ${
                formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <FaCheck className="mr-1" />
                    <span>Les mots de passe correspondent</span>
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-1" />
                    <span>Les mots de passe ne correspondent pas</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Conseils de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2 flex items-center">
              <FaLock className="mr-2" />
              Conseils de sécurité
            </h3>
            <ul className="text-sm text-neutral space-y-1">
              <li>• Utilisez au moins 8 caractères pour plus de sécurité</li>
              <li>• Combinez majuscules, minuscules, chiffres et caractères spéciaux</li>
              <li>• Évitez les mots courants ou dates de naissance</li>
              <li>• Ne réutilisez pas un ancien mot de passe</li>
            </ul>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full justify-center"
          >
            <FaLock />
            <span>{loading ? 'Modification en cours...' : 'Changer le mot de passe'}</span>
          </button>
          
          {!isFormValid() && formData.currentPassword && formData.newPassword && formData.confirmPassword && (
            <p className="text-sm text-center text-amber-600">
              Veuillez corriger les erreurs avant de soumettre
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;