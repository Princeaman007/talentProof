import express from 'express';
import {
  createTalent,
  getAllTalentsAdmin,
  updateTalent,
  deleteTalent,
  getAllContactRequests,
  updateContactRequestStatus,
  getEntreprisesCount, 
  getGlobalStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { talentValidation } from '../utils/Validation.js';

const router = express.Router();

// Toutes les routes admin nécessitent authentification + droits admin
router.use(protect);
router.use(adminOnly);

// Gestion des talents
router.post('/talents', talentValidation, createTalent);
router.get('/talents', getAllTalentsAdmin);
router.put('/talents/:id', updateTalent);
router.delete('/talents/:id', deleteTalent);

// Gestion des demandes de contact
router.get('/contact-requests', getAllContactRequests);
router.put('/contact-requests/:id', updateContactRequestStatus);
router.get('/entreprises/count', getEntreprisesCount);
router.get('/stats', getGlobalStats);

// ✅ AJOUTE CETTE LIGNE
export default router;