/**
 * Traductions françaises des codes d'erreur API
 * Mappe les codes d'erreur backend aux messages utilisateur conviviaux
 */

export const errorTranslations = {
  // Erreurs d'authentification
  EMAIL_ALREADY_EXISTS: 'Cette adresse email est déjà utilisée',
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  EMAIL_NOT_CONFIRMED: 'Veuillez confirmer votre email avant de vous connecter',
  ACCOUNT_INACTIVE: 'Votre compte a été suspendu. Veuillez contacter le support',
  TOKEN_INVALID: 'Session invalide. Veuillez vous reconnecter',
  TOKEN_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter',
  UNAUTHORIZED: 'Vous devez être connecté pour effectuer cette action',
  
  // Erreurs de validation
  VALIDATION_ERROR: 'Les données fournies sont invalides',
  INVALID_EMAIL_FORMAT: 'Format d\'email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 6 caractères',
  PASSWORD_TOO_WEAK: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_PHONE_FORMAT: 'Format de téléphone invalide',
  INVALID_DATE: 'Date invalide',
  
  // Erreurs de ressources
  RESOURCE_NOT_FOUND: 'Ressource introuvable',
  DUPLICATE_ENTRY: 'Cet enregistrement existe déjà',
  
  // Erreurs TalentDays
  TALENTDAY_FULL: 'Cet événement est complet',
  ALREADY_REGISTERED: 'Vous êtes déjà inscrit à cet événement',
  NOT_REGISTERED: 'Vous n\'êtes pas inscrit à cet événement',
  REGISTRATION_CLOSED: 'Les inscriptions pour cet événement sont fermées',
  CANCELLATION_DEADLINE_PASSED: 'Le délai d\'annulation est dépassé',
  TALENTDAY_NOT_FOUND: 'Événement introuvable',
  TALENT_NOT_FOUND: 'Talent introuvable',
  
  // Erreurs de permissions
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
  ADMIN_ONLY: 'Cette action est réservée aux administrateurs',
  
  // Erreurs de fichiers
  FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 5 MB)',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  UPLOAD_FAILED: 'Échec de l\'upload du fichier',
  
  // Erreurs emails
  EMAIL_SEND_FAILED: 'Échec de l\'envoi de l\'email. Veuillez réessayer',
  EMAIL_CONFIGURATION_ERROR: 'Erreur de configuration email',
  
  // Erreurs serveur
  INTERNAL_SERVER_ERROR: 'Une erreur inattendue est survenue. Veuillez réessayer',
  DATABASE_ERROR: 'Erreur de base de données. Veuillez réessayer',
  SERVICE_UNAVAILABLE: 'Service temporairement indisponible. Veuillez réessayer dans quelques instants',
  
  // Erreurs réseau
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet',
  TIMEOUT_ERROR: 'La requête a expiré. Veuillez réessayer',
  RATE_LIMIT_EXCEEDED: 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer',
  TOO_MANY_REQUESTS: 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer',
  
  // Défaut
  UNKNOWN_ERROR: 'Une erreur est survenue. Veuillez réessayer'
};

/**
 * Traduit un code d'erreur en message français
 * 
 * @param {string} errorCode - Code d'erreur de l'API
 * @param {string} fallbackMessage - Message de secours si pas de traduction
 * @returns {string} Message d'erreur traduit
 */
export const translateError = (errorCode, fallbackMessage = null) => {
  if (!errorCode) {
    return fallbackMessage || errorTranslations.UNKNOWN_ERROR;
  }
  
  return errorTranslations[errorCode] || fallbackMessage || errorTranslations.UNKNOWN_ERROR;
};

/**
 * Extrait et formate les erreurs de validation
 * 
 * @param {Array} validationErrors - Tableau d'erreurs de validation
 * @returns {Array} Erreurs formatées pour ErrorMessage
 */
export const formatValidationErrors = (validationErrors) => {
  if (!Array.isArray(validationErrors)) {
    return [];
  }
  
  return validationErrors.map(err => ({
    field: err.field || err.param,
    message: translateError(err.code, err.message)
  }));
};

export default {
  errorTranslations,
  translateError,
  formatValidationErrors
};
