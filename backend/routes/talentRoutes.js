import express from 'express';
import {
  getAllTalents,
  filterTalents,
  getTalentById,
  contactTalent,
} from '../controllers/talentController.js';
import { contactRequestValidation } from '../utils/validation.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllTalents);
router.get('/filter', filterTalents);
router.get('/:id', getTalentById);
router.post('/contact', contactRequestValidation, contactTalent);

export default router;