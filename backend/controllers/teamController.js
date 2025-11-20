import TeamMember from '../models/TeamMember.js';
import AppError, { 
  validationError, 
  emailAlreadyExists,
  notFound,
  internalError,
  unauthorized,
  forbidden
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * @route   GET /api/team
 * @desc    Obtenir tous les membres de l'équipe
 * @access  Public
 */
export const getAllTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.find().sort({ ordre: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: teamMembers.length,
    data: teamMembers,
  });
});

/**
 * @route   POST /api/admin/team
 * @desc    Ajouter un membre de l'équipe
 * @access  Private/Admin
 */
export const createTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Membre ajouté avec succès.',
    data: teamMember,
  });
});

/**
 * @route   PUT /api/admin/team/:id
 * @desc    Modifier un membre de l'équipe
 * @access  Private/Admin
 */
export const updateTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!teamMember) {
    throw notFound('Membre');
  }

  res.status(200).json({
    success: true,
    message: 'Membre mis à jour avec succès.',
    data: teamMember,
  });
});

/**
 * @route   DELETE /api/admin/team/:id
 * @desc    Supprimer un membre de l'équipe
 * @access  Private/Admin
 */
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

  if (!teamMember) {
    throw notFound('Membre');
  }

  res.status(200).json({
    success: true,
    message: 'Membre supprimé avec succès.',
  });
});