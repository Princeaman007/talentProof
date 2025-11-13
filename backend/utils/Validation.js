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
 * ✅ CORRIGÉ - Validation pour création/modification talent
 */
export const talentValidation = [
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  
  body('typeProfil')
    .optional()
    .isIn(['Frontend', 'Backend', 'Full-stack', 'Mobile', 'DevOps', 'Data']).withMessage('Type de profil invalide'),
  
  body('niveau')
    .optional()
    .isIn(['Junior', 'Medior', 'Senior']).withMessage('Niveau invalide'),
  
  body('typeContrat')
    .optional()
    .isIn(['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']).withMessage('Type de contrat invalide'),
  
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
    .notEmpty().withMessage('Les années d\'expérience sont requises')
    .isNumeric().withMessage('Les années d\'expérience doivent être un nombre')
    .isInt({ min: 0, max: 50 }).withMessage('Les années d\'expérience doivent être entre 0 et 50'),
  
  body('disponibilite')
    .optional()
    .isIn(['Immédiate', '1-2 semaines', '1 mois', 'Non disponible']).withMessage('Disponibilité invalide'),
  
  body('localisation')
    .optional()
    .trim(),
  
  body('langues')
    .optional()
    .isArray().withMessage('Les langues doivent être un tableau'),
  
  body('tarifJournalier')
    .optional()
    .isNumeric().withMessage('Le tarif journalier doit être un nombre')
    .isInt({ min: 0 }).withMessage('Le tarif journalier doit être positif'),
  
  body('portfolio')
    .optional()
    .isURL().withMessage('URL du portfolio invalide'),
  
  body('github')
    .optional()
    .isURL().withMessage('URL GitHub invalide'),
  
  body('linkedin')
    .optional()
    .isURL().withMessage('URL LinkedIn invalide'),
  
  body('statut')
    .optional()
    .isIn(['actif', 'inactif', 'en_mission']).withMessage('Statut invalide'),
  
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
  .optional({ values: 'falsy' })  
  .trim()
  .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).withMessage('Numéro de téléphone invalide'),
  
  body('entreprise')
    .trim()
    .notEmpty().withMessage('Le nom de l\'entreprise est requis'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 8 }).withMessage('Le message doit contenir au moins 20 caractères'),
  
  validate,
];

/**
 * ✅ Validation pour membre d'équipe - CORRIGÉE
 */
export const teamMemberValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  
  body('poste')
    .trim()
    .notEmpty().withMessage('Le poste est requis'),
  
  body('bio')
    .trim()
    .notEmpty().withMessage('La biographie est requise')
    .isLength({ min: 20 }).withMessage('La biographie doit contenir au moins 20 caractères'),
  
  // ✅ CORRECTION : Utiliser optional({ values: 'falsy' }) pour permettre les chaînes vides
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('linkedin')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('URL LinkedIn invalide'),
  
  validate,
];