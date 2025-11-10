import express from 'express';
import { getAllTeamMembers } from '../controllers/teamController.js';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { teamMemberValidation } from '../utils/validation.js';

const router = express.Router();

// Route publique
router.get('/', getAllTeamMembers);

// Routes admin
router.post('/', protect, adminOnly, teamMemberValidation, createTeamMember);
router.put('/:id', protect, adminOnly, updateTeamMember);
router.delete('/:id', protect, adminOnly, deleteTeamMember);

export default router;