import { Link } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        {/* Icône */}
        <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
          <FaEnvelope className="text-accent text-4xl" />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-primary mb-4">
          Vérifiez votre email
        </h1>

        {/* Message */}
        <p className="text-neutral mb-6">
          Un email de confirmation a été envoyé à votre adresse email.
          Cliquez sur le lien dans l'email pour activer votre compte.
        </p>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-primary mb-2">📬 Que faire maintenant ?</h3>
          <ul className="text-sm text-neutral space-y-1">
            <li>1. Ouvrez votre boîte mail</li>
            <li>2. Cherchez l'email de TalentProof</li>
            <li>3. Cliquez sur le lien de confirmation</li>
            <li>4. Revenez vous connecter</li>
          </ul>
        </div>

        {/* Note */}
        <p className="text-sm text-neutral mb-6">
          💡 <strong>Note :</strong> En mode développement, le compte est activé automatiquement.
          Vous pouvez vous connecter directement.
        </p>

        {/* Bouton */}
        <Link to="/login" className="btn-primary inline-block">
          Aller à la connexion
        </Link>

        {/* Support */}
        <p className="text-sm text-neutral mt-6">
          Problème ? Contactez-nous à{' '}
          <a href="mailto:info@princeaman.dev" className="text-primary font-semibold">
            info@princeaman.dev
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmation;