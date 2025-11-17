/**
 * Gestion d'erreurs centralisée
 * ✅ Classes d'erreurs personnalisées
 * ✅ Messages cohérents
 * ✅ Logging automatique
 */
import { logger } from './logger.js';

/**
 * Erreur personnalisée
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
  }
}

/**
 * Erreur de validation (400)
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * Erreur d'authentification (401)
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentification requise') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Erreur d'autorisation (403)
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Accès refusé') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Erreur ressource non trouvée (404)
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Ressource', message = null) {
    super(
      message || `${resource} non trouvée`,
      404,
      'NOT_FOUND_ERROR'
    );
    this.resource = resource;
  }
}

/**
 * Erreur conflit (409)
 */
export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Middleware de gestion d'erreurs globale
 * ✅ À ajouter dans server.js en dernier
 */
export const errorHandler = (err, req, res, next) => {
  // Par défaut: erreur interne
  let error = err;
  if (!(err instanceof AppError)) {
    error = new AppError(
      err.message || 'Erreur interne',
      err.statusCode || 500,
      err.code || 'INTERNAL_ERROR'
    );
  }

  // Logger l'erreur
  const logContext = {
    code: error.code,
    statusCode: error.statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
  };

  if (error.statusCode >= 500) {
    logger.error(error.message, { ...logContext, stack: error.stack });
  } else {
    logger.warn(error.message, logContext);
  }

  // Répondre au client
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(isDevelopment && { stack: error.stack }),
      ...(error.details && { details: error.details }),
    },
    timestamp: error.timestamp,
    path: req.path,
  });
};

export default errorHandler;
