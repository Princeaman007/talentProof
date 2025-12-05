import React from 'react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Composant professionnel d'affichage d'erreurs
 * Supporte les erreurs simples et les erreurs multiples (validation)
 * 
 * @param {string} message - Message d'erreur principal
 * @param {Array} details - Tableau d'erreurs détaillées (optionnel)
 * @param {string} type - Type d'erreur: 'error', 'warning', 'info' (défaut: 'error')
 * @param {function} onClose - Callback pour fermer l'erreur (optionnel)
 */
const ErrorMessage = ({ message, details = null, type = 'error', onClose = null }) => {
  // DEBUG: Logger pour diagnostiquer les problèmes d'affichage
  
  if (!message && !details) {
    return null;
  }

  // Configuration selon le type
  const config = {
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      title: 'Erreur'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      title: 'Attention'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      title: 'Information'
    }
  };

  const style = config[type] || config.error;
  const Icon = style.icon;

  return (
    <div 
      className={`${style.bgColor} border ${style.borderColor} rounded-lg p-4 mb-4 relative`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <Icon className={`${style.iconColor} w-5 h-5 mr-3 mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1">
          {message && (
            <p className={`${style.textColor} font-medium mb-1`}>
              {message}
            </p>
          )}
          
          {details && Array.isArray(details) && details.length > 0 && (
            <ul className={`${style.textColor} text-sm mt-2 space-y-1 list-disc list-inside`}>
              {details.map((detail, index) => (
                <li key={index}>
                  {detail.field && <strong>{detail.field}:</strong>}{' '}
                  {detail.message || detail}
                </li>
              ))}
            </ul>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`${style.textColor} hover:opacity-70 ml-3 flex-shrink-0`}
            aria-label="Fermer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Composant inline pour les erreurs de champs individuels
 * Usage: sous un input de formulaire
 */
export const FieldError = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="text-red-600 text-sm mt-1 flex items-center">
      <XCircle className="w-4 h-4 mr-1 flex-shrink-0" />
      {error}
    </p>
  );
};

/**
 * Composant de message de succès
 */
export const SuccessMessage = ({ message, onClose = null }) => {
  if (!message) return null;
  
  return (
    <div 
      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 relative"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <svg 
          className="text-green-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
        
        <p className="text-green-800 font-medium flex-1">
          {message}
        </p>

        {onClose && (
          <button
            onClick={onClose}
            className="text-green-800 hover:opacity-70 ml-3 flex-shrink-0"
            aria-label="Fermer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
