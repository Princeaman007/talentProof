import express from 'express';
import { body } from 'express-validator';
import {
  createCompanyRegistration,
  getCompanyRegistrations,
  getCompanyDetails,
  updateCompanyStatus,
  bookTalentMeeting,
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Validation middleware
const validateCompanyRegistration = [
  body('companyName').trim().notEmpty().withMessage('Le nom de l\'entreprise est requis'),
  body('contactPerson').trim().notEmpty().withMessage('Le nom du contact est requis'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('website').trim().optional({ checkFalsy: true }).isURL().withMessage('URL invalide'),
  body('interestedTalentDays')
    .isArray({ min: 1 }).withMessage('Sélectionnez au moins un TalentDay'),
  body('notes').trim().optional({ checkFalsy: true }).isLength({ max: 1000 }).withMessage('Les notes ne peuvent pas dépasser 1000 caractères'),
];

const validateMeetingRequest = [
  body('talentId').notEmpty().withMessage('L\'ID du talent est requis'),
  body('talentDayId').notEmpty().withMessage('L\'ID du TalentDay est requis'),
  body('proposedDate').isISO8601().withMessage('Date invalide'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Le message ne peut pas dépasser 500 caractères'),
];

/**
 * @route   POST /api/companies
 * @desc    Créer une inscription entreprise
 * @access  Public
 */
router.post('/', validateCompanyRegistration, createCompanyRegistration);

/**
 * @route   GET /api/companies
 * @desc    Récupérer toutes les inscriptions (admin)
 * @access  Admin
 */
router.get('/', protect, isAdmin, getCompanyRegistrations);

/**
 * @route   GET /api/companies/:id
 * @desc    Récupérer les détails d'une inscription
 * @access  Admin ou propriétaire
 */
router.get('/:id', protect, getCompanyDetails);

/**
 * @route   PATCH /api/companies/:id/status
 * @desc    Mettre à jour le statut d'une inscription
 * @access  Admin
 */
router.patch('/:id/status', protect, isAdmin, updateCompanyStatus);

/**
 * @route   POST /api/companies/:id/book
 * @desc    Réserver un meeting avec un talent
 * @access  Entreprise confirmée ou Admin
 */
router.post('/:id/book', protect, validateMeetingRequest, bookTalentMeeting);

export default router;
