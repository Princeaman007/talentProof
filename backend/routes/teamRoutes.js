import express from 'express';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { teamMemberValidation } from '../utils/Validation.js';

const router = express.Router();

// Route publique
router.get('/', getAllTeamMembers);

// Routes admin (protégées)
router.post('/', protect, adminOnly, teamMemberValidation, createTeamMember);
router.put('/:id', protect, adminOnly, updateTeamMember);
router.delete('/:id', protect, adminOnly, deleteTeamMember);

export default router;
