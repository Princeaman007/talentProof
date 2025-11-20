import AppError, { ErrorCodes } from './AppError.js';
import { logger } from './logger.js';

/**
 * Middleware global de gestion des erreurs
 * Capture toutes les erreurs non gérées et formate les réponses
 * 
 * @param {Error} err - L'erreur capturée
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {NextFunction} next - Fonction next d'Express
 */
export const errorHandler = (err, req, res, next) => {
  // Configuration selon l'environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log l'erreur pour le debugging
  logError(err, req);
  
  // Si c'est une AppError (erreur opérationnelle prévue)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        ...(isDevelopment && {
          stack: err.stack,
          timestamp: err.timestamp
        })
      }
    });
  }
  
  // Gestion des erreurs MongoDB spécifiques
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return handleMongoError(err, res, isDevelopment);
  }
  
  // Gestion des erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    return handleValidationError(err, res, isDevelopment);
  }
  
  // Gestion des erreurs de cast (ID MongoDB invalide)
  if (err.name === 'CastError') {
    return handleCastError(err, res, isDevelopment);
  }
  
  // Gestion des erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: ErrorCodes.TOKEN_INVALID,
        message: 'Token d\'authentification invalide',
        ...(isDevelopment && { stack: err.stack })
      }
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: ErrorCodes.TOKEN_EXPIRED,
        message: 'Votre session a expiré. Veuillez vous reconnecter',
        ...(isDevelopment && { stack: err.stack })
      }
    });
  }
  
  // Gestion des erreurs de connexion réseau
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: {
        code: ErrorCodes.SERVICE_UNAVAILABLE,
        message: 'Service temporairement indisponible. Veuillez réessayer',
        ...(isDevelopment && { stack: err.stack, errorCode: err.code })
      }
    });
  }
  
  // Erreur inconnue (500)
  logger.error('UNHANDLED ERROR:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: isDevelopment 
        ? err.message 
        : 'Une erreur inattendue est survenue. Notre équipe a été notifiée',
      ...(isDevelopment && { 
        stack: err.stack,
        name: err.name
      })
    }
  });
};

/**
 * Gestion spécifique des erreurs MongoDB
 */
function handleMongoError(err, res, isDevelopment) {
  // Erreur de doublon (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    
    return res.status(409).json({
      success: false,
      error: {
        code: ErrorCodes.DUPLICATE_ENTRY,
        message: `Un enregistrement avec ${field} "${value}" existe déjà`,
        field,
        ...(isDevelopment && { stack: err.stack })
      }
    });
  }
  
  // Erreur de connexion MongoDB
  if (err.name === 'MongoNetworkError' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      success: false,
      error: {
        code: ErrorCodes.DATABASE_ERROR,
        message: 'Erreur de connexion à la base de données. Veuillez réessayer',
        ...(isDevelopment && { stack: err.stack })
      }
    });
  }
  
  // Autres erreurs MongoDB
  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.DATABASE_ERROR,
      message: 'Erreur de base de données',
      ...(isDevelopment && { 
        stack: err.stack,
        mongoError: err.message 
      })
    }
  });
}

/**
 * Gestion des erreurs de validation Mongoose
 */
function handleValidationError(err, res, isDevelopment) {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message,
    value: error.value
  }));
  
  return res.status(400).json({
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Erreur de validation des données',
      details: errors,
      ...(isDevelopment && { stack: err.stack })
    }
  });
}

/**
 * Gestion des erreurs de cast (ID invalide)
 */
function handleCastError(err, res, isDevelopment) {
  return res.status(400).json({
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: `Identifiant invalide: ${err.value}`,
      field: err.path,
      ...(isDevelopment && { stack: err.stack })
    }
  });
}

/**
 * Log les erreurs de manière structurée
 */
function logError(err, req) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: err.message,
      name: err.name,
      code: err.code || err.errorCode,
      stack: err.stack
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?._id
    }
  };
  
  // Log selon le type d'erreur
  if (err instanceof AppError && err.isOperational) {
    logger.warn('OPERATIONAL ERROR:', errorLog);
  } else {
    logger.error('SYSTEM ERROR:', errorLog);
  }
}

/**
 * Middleware pour capturer les erreurs asynchrones
 * Évite d'avoir à écrire try/catch dans chaque contrôleur
 * 
 * Usage: export const myController = asyncHandler(async (req, res) => { ... });
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware pour les routes non trouvées (404)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} introuvable`,
    ErrorCodes.RESOURCE_NOT_FOUND,
    404
  );
  next(error);
};

/**
 * Wrapper pour les contrôleurs avec validation automatique
 * Vérifie automatiquement les erreurs de validation express-validator
 */
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Importer validationResult ici pour éviter les dépendances circulaires
    const { validationResult } = await import('express-validator');
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // Formater les erreurs
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Erreur de validation',
        details: formattedErrors
      }
    });
  };
};

export default errorHandler;
