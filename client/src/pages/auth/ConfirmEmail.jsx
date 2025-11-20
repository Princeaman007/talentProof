import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { extractErrorMessage } from '../../utils/errorHandler';

const ConfirmEmail = () => {
  const { token } = useParams();
  const _navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmation manquant.');
        return;
      }

      try {
        const response = await api.get(`/auth/confirm/${token}`);
        
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email confirmé avec succès !');
        } else {
          setStatus('error');
          setMessage(response.message || 'Erreur lors de la confirmation.');
        }
      } catch (error) {
        console.error('Erreur confirmation:', error);
        setStatus('error');
        setMessage(
          extractErrorMessage(error, 
            'Token invalide ou expiré. Veuillez réessayer ou contacter le support.')
        );
      }
    };

    confirmEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <FaSpinner className="text-primary text-4xl animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Confirmation en cours...
          </h2>
          <p className="text-neutral">
            Veuillez patienter pendant que nous confirmons votre email.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          {/* Icône succès */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-primary mb-4">
             Email confirmé !
          </h2>

          {/* Message */}
          <p className="text-neutral mb-6">
            {message}
          </p>

          {/* Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2"> Votre compte est activé</h3>
            <p className="text-sm text-green-700">
              Vous pouvez maintenant vous connecter et accéder à toutes les fonctionnalités de TalentProof.
            </p>
          </div>

          {/* Bouton connexion */}
          <Link to="/login" className="btn-primary inline-block mb-4">
            Se connecter maintenant
          </Link>

          <p className="text-sm text-neutral">
            Vous serez redirigé vers votre tableau de bord après connexion.
          </p>
        </div>
      </div>
    );
  }

  // Status === 'error'
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        {/* Icône erreur */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <FaTimesCircle className="text-red-600 text-4xl" />
        </div>

        {/* Titre */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">
           Erreur de confirmation
        </h2>

        {/* Message d'erreur */}
        <p className="text-neutral mb-6">
          {message}
        </p>

        {/* Info */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-800 mb-2">Que faire ?</h3>
          <ul className="text-sm text-red-700 space-y-2">
            <li>• Vérifiez que vous avez cliqué sur le bon lien</li>
            <li>• Le lien expire après 24 heures</li>
            <li>• Contactez le support si le problème persiste</li>
          </ul>
        </div>

        {/* Boutons */}
        <div className="space-y-3">
          <Link to="/register" className="btn-primary inline-block w-full">
            Créer un nouveau compte
          </Link>
          <Link to="/login" className="block text-primary font-semibold hover:underline">
            Déjà un compte ? Se connecter
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-neutral mt-6">
          Besoin d'aide ?{' '}
          <a href="mailto:info@princeaman.dev" className="text-primary font-semibold hover:underline">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
