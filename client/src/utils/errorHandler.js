/**
 * Utilitaire pour extraire les messages d'erreur de manière cohérente
 * à travers toute l'application
 */

/**
 * Extrait le message d'erreur d'un objet erreur
 * Gère différentes structures d'erreur possibles
 * 
 * @param {Error|Object} error - L'objet erreur
 * @param {string} defaultMessage - Message par défaut si aucun message trouvé
 * @returns {string} Le message d'erreur extrait
 */
export const extractErrorMessage = (error, defaultMessage = 'Une erreur est survenue') => {
  if (!error) return defaultMessage;

  // Structure: { response: { data: { error: { message } } } }
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Structure: { response: { data: { message } } }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Structure: { error: { message } }
  if (error.error?.message) {
    return error.error.message;
  }

  // Structure: { message }
  if (error.message) {
    return error.message;
  }

  // Si c'est une chaîne directement
  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

/**
 * Extrait les détails d'erreur de validation
 * 
 * @param {Error|Object} error - L'objet erreur
 * @returns {Array|null} Tableau de détails d'erreur ou null
 */
export const extractErrorDetails = (error) => {
  if (!error) return null;

  // Structure: { response: { data: { error: { details } } } }
  if (error.response?.data?.error?.details) {
    return error.response.data.error.details;
  }

  // Structure: { error: { details } }
  if (error.error?.details) {
    return error.error.details;
  }

  return null;
};

/**
 * Formate une erreur pour l'affichage dans ErrorMessage
 * 
 * @param {Error|Object} error - L'objet erreur
 * @param {string} defaultMessage - Message par défaut
 * @returns {Object} { message, details }
 */
export const formatError = (error, defaultMessage = 'Une erreur est survenue') => {
  return {
    message: extractErrorMessage(error, defaultMessage),
    details: extractErrorDetails(error)
  };
};

export default {
  extractErrorMessage,
  extractErrorDetails,
  formatError
};
