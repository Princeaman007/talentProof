
import { body, validationResult } from 'express-validator';

/**
 * Middleware pour vérifier les erreurs de validation
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

/**
 * Validation pour l'inscription entreprise
 */
export const registerValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom de l\'entreprise est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  body('nombreEmployes')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '500+']).withMessage('Taille d\'entreprise invalide'),
  
  validate,
];

/**
 * Validation pour la connexion
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
  
  validate,
];

/**
 * Validation pour mot de passe oublié
 */
export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  validate,
];

/**
 * Validation pour reset mot de passe
 */
export const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  validate,
];

/**
 * Validation pour création/modification talent
 */
export const talentValidation = [
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  
  body('technologies')
    .isArray({ min: 1 }).withMessage('Au moins une technologie est requise'),
  
  body('competences')
    .trim()
    .notEmpty().withMessage('Les compétences sont requises')
    .isLength({ min: 10 }).withMessage('Les compétences doivent contenir au moins 10 caractères'),
  
  body('scoreTest')
    .isNumeric().withMessage('Le score doit être un nombre')
    .isInt({ min: 0, max: 100 }).withMessage('Le score doit être entre 0 et 100'),
  
  body('plateforme')
    .notEmpty().withMessage('La plateforme de test est requise')
    .isIn(['Codingame', 'HackerRank', 'LeetCode', 'CodeWars', 'Autre']).withMessage('Plateforme invalide'),
  
  body('anneeExperience')
    .trim()
    .notEmpty().withMessage('L\'année d\'expérience/formation est requise'),
  
  validate,
];

/**
 * Validation pour demande de contact talent
 */
export const contactRequestValidation = [
  body('talentId')
    .notEmpty().withMessage('L\'ID du talent est requis')
    .isMongoId().withMessage('ID talent invalide'),
  
  body('recruteurNom')
    .trim()
    .notEmpty().withMessage('Le nom du recruteur est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  
  body('recruteurEmail')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('recruteurTel')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).withMessage('Numéro de téléphone invalide'),
  
  body('entreprise')
    .trim()
    .notEmpty().withMessage('Le nom de l\'entreprise est requis'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 20 }).withMessage('Le message doit contenir au moins 20 caractères'),
  
  validate,
];

/**
 * Validation pour membre d'équipe
 */
export const teamMemberValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  
  body('position')
    .trim()
    .notEmpty().withMessage('La position est requise'),
  
  body('specialite')
    .trim()
    .notEmpty().withMessage('La spécialité est requise'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La description est requise')
    .isLength({ min: 20 }).withMessage('La description doit contenir au moins 20 caractères'),
  
  body('linkedIn')
    .optional()
    .isURL().withMessage('URL LinkedIn invalide'),
  
  body('twitter')
    .optional()
    .isURL().withMessage('URL Twitter invalide'),
  
  validate,
];