import express from 'express';
import {
  getAllTalents,
  filterTalents,
  getTalentById,
  contactTalent,
  getTalentsStats, // ✅ Importer la nouvelle fonction
} from '../controllers/talentController.js';
import { contactRequestValidation } from '../utils/Validation.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllTalents);
router.get('/filter', filterTalents);
router.get('/stats', getTalentsStats); // ✅ NOUVEAU - IMPORTANT: Avant /:id
router.get('/:id', getTalentById);
router.post('/contact', contactRequestValidation, contactTalent);

export default router;