/**
 * Classe d'erreur personnalisée pour l'application TalentProof
 * Permet une gestion cohérente des erreurs avec codes, messages et statuts HTTP
 */
class AppError extends Error {
  constructor(message, errorCode, statusCode = 500, isOperational = true) {
    super(message);
    
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Codes d'erreur standardisés pour toute l'application
 * Utilisés pour identifier et traduire les erreurs côté frontend
 */
export const ErrorCodes = {
  // AUTHENTIFICATION
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACCOUNT_NOT_CONFIRMED: 'ACCOUNT_NOT_CONFIRMED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  
  // VALIDATION
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_COMPANY_NAME: 'INVALID_COMPANY_NAME',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  INVALID_DATE_FORMAT: 'INVALID_DATE_FORMAT',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // BASE DE DONNÉES
  DATABASE_ERROR: 'DATABASE_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  REFERENCE_ERROR: 'REFERENCE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // TALENTDAYS
  TALENTDAY_NOT_FOUND: 'TALENTDAY_NOT_FOUND',
  TALENTDAY_FULL: 'TALENTDAY_FULL',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  REGISTRATION_NOT_OPEN: 'REGISTRATION_NOT_OPEN',
  EVENT_ALREADY_PASSED: 'EVENT_ALREADY_PASSED',
  
  // TALENTS
  TALENT_NOT_FOUND: 'TALENT_NOT_FOUND',
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE',
  
  // ENTREPRISES
  COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
  COMPANY_NOT_APPROVED: 'COMPANY_NOT_APPROVED',
  
  // SERVEUR
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // EMAILS
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  INVALID_EMAIL_TEMPLATE: 'INVALID_EMAIL_TEMPLATE',
  
  // UPLOADS
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  
  // PERMISSIONS
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ADMIN_ONLY: 'ADMIN_ONLY',
  OWNER_ONLY: 'OWNER_ONLY',
};

/**
 * Fonctions helper pour créer des erreurs courantes rapidement
 */
export const createError = {
  // Authentification
  emailAlreadyExists: (email) => 
    new AppError(
      `L'adresse email ${email} est déjà utilisée`,
      ErrorCodes.EMAIL_ALREADY_EXISTS,
      409
    ),
  
  invalidCredentials: () => 
    new AppError(
      'Email ou mot de passe incorrect',
      ErrorCodes.INVALID_CREDENTIALS,
      401
    ),
  
  unauthorized: (message = 'Authentification requise') => 
    new AppError(
      message,
      ErrorCodes.UNAUTHORIZED,
      401
    ),
  
  forbidden: (message = 'Accès refusé') => 
    new AppError(
      message,
      ErrorCodes.FORBIDDEN,
      403
    ),
  
  tokenExpired: () => 
    new AppError(
      'Votre session a expiré. Veuillez vous reconnecter',
      ErrorCodes.TOKEN_EXPIRED,
      401
    ),
  
  accountNotConfirmed: () => 
    new AppError(
      'Veuillez confirmer votre email avant de vous connecter',
      ErrorCodes.ACCOUNT_NOT_CONFIRMED,
      403
    ),
  
  // Validation
  validationError: (message) => 
    new AppError(
      message,
      ErrorCodes.VALIDATION_ERROR,
      400
    ),
  
  requiredField: (fieldName) => 
    new AppError(
      `Le champ ${fieldName} est obligatoire`,
      ErrorCodes.REQUIRED_FIELD_MISSING,
      400
    ),
  
  invalidEmail: () => 
    new AppError(
      'Format d\'email invalide',
      ErrorCodes.INVALID_EMAIL_FORMAT,
      400
    ),
  
  passwordTooShort: (minLength = 6) => 
    new AppError(
      `Le mot de passe doit contenir au moins ${minLength} caractères`,
      ErrorCodes.PASSWORD_TOO_SHORT,
      400
    ),
  
  passwordsDoNotMatch: () => 
    new AppError(
      'Les mots de passe ne correspondent pas',
      ErrorCodes.PASSWORDS_DO_NOT_MATCH,
      400
    ),
  
  // Base de données
  notFound: (resourceType, identifier = '') => 
    new AppError(
      identifier 
        ? `${resourceType} avec l'identifiant ${identifier} introuvable`
        : `${resourceType} introuvable`,
      ErrorCodes.RESOURCE_NOT_FOUND,
      404
    ),
  
  duplicateEntry: (field) => 
    new AppError(
      `Une entrée avec ce ${field} existe déjà`,
      ErrorCodes.DUPLICATE_ENTRY,
      409
    ),
  
  databaseError: (details = '') => 
    new AppError(
      'Erreur de base de données. Veuillez réessayer',
      ErrorCodes.DATABASE_ERROR,
      500,
      false // Erreur système, pas opérationnelle
    ),
  
  // TalentDays
  talentDayNotFound: (id) => 
    new AppError(
      `TalentDay ${id} introuvable`,
      ErrorCodes.TALENTDAY_NOT_FOUND,
      404
    ),
  
  talentDayFull: () => 
    new AppError(
      'Cet événement est complet. Il n\'y a plus de places disponibles',
      ErrorCodes.TALENTDAY_FULL,
      409
    ),
  
  alreadyRegistered: () => 
    new AppError(
      'Vous êtes déjà inscrit à cet événement',
      ErrorCodes.ALREADY_REGISTERED,
      409
    ),
  
  registrationClosed: () => 
    new AppError(
      'Les inscriptions pour cet événement sont fermées',
      ErrorCodes.REGISTRATION_CLOSED,
      403
    ),
  
  eventPassed: () => 
    new AppError(
      'Cet événement est déjà passé',
      ErrorCodes.EVENT_ALREADY_PASSED,
      400
    ),
  
  // Serveur
  internalError: (message = 'Une erreur est survenue') => 
    new AppError(
      message,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
      false
    ),
  
  serviceUnavailable: () => 
    new AppError(
      'Service temporairement indisponible. Veuillez réessayer plus tard',
      ErrorCodes.SERVICE_UNAVAILABLE,
      503,
      false
    ),
  
  // Emails
  emailFailed: () => 
    new AppError(
      'Erreur lors de l\'envoi de l\'email',
      ErrorCodes.EMAIL_SEND_FAILED,
      500,
      true // Opérationnel car l'envoi d'email peut échouer normalement
    ),
  
  // Uploads
  uploadFailed: (reason = '') => 
    new AppError(
      `Échec du téléchargement du fichier${reason ? ': ' + reason : ''}`,
      ErrorCodes.UPLOAD_FAILED,
      400
    ),
  
  fileTooLarge: (maxSize) => 
    new AppError(
      `Le fichier est trop volumineux. Taille maximale: ${maxSize}`,
      ErrorCodes.FILE_TOO_LARGE,
      400
    ),
  
  invalidFileType: (allowedTypes) => 
    new AppError(
      `Type de fichier invalide. Types acceptés: ${allowedTypes.join(', ')}`,
      ErrorCodes.INVALID_FILE_TYPE,
      400
    ),
  
  // Permissions
  adminOnly: () => 
    new AppError(
      'Cette action est réservée aux administrateurs',
      ErrorCodes.ADMIN_ONLY,
      403
    ),
  
  insufficientPermissions: () => 
    new AppError(
      'Vous n\'avez pas les permissions nécessaires',
      ErrorCodes.INSUFFICIENT_PERMISSIONS,
      403
    ),
};

// Exports directs pour compatibilité
export const emailAlreadyExists = createError.emailAlreadyExists;
export const invalidCredentials = createError.invalidCredentials;
export const unauthorized = createError.unauthorized;
export const forbidden = createError.forbidden;
export const tokenExpired = createError.tokenExpired;
export const accountNotConfirmed = createError.accountNotConfirmed;
export const emailNotConfirmed = createError.accountNotConfirmed;
export const accountInactive = createError.forbidden;
export const tokenInvalid = createError.unauthorized;
export const notFound = createError.notFound;
export const validationError = createError.validationError;
export const internalError = createError.internalServerError;
export const requiredField = createError.requiredField;
export const invalidEmail = createError.invalidEmail;
export const passwordTooShort = createError.passwordTooShort;

export default AppError;
