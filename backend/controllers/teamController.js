import TeamMember from '../models/TeamMember.js';

/**
 * @route   GET /api/team
 * @desc    Obtenir tous les membres de l'équipe
 * @access  Public
 */
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ ordre: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (error) {
    console.error('Erreur getAllTeamMembers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des membres.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/admin/team
 * @desc    Ajouter un membre de l'équipe
 * @access  Private/Admin
 */
export const createTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Membre ajouté avec succès.',
      data: teamMember,
    });
  } catch (error) {
    console.error('Erreur createTeamMember:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de l\'ajout du membre.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/team/:id
 * @desc    Modifier un membre de l'équipe
 * @access  Private/Admin
 */
export const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Membre introuvable.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membre mis à jour avec succès.',
      data: teamMember,
    });
  } catch (error) {
    console.error('Erreur updateTeamMember:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du membre.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   DELETE /api/admin/team/:id
 * @desc    Supprimer un membre de l'équipe
 * @access  Private/Admin
 */
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Membre introuvable.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membre supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur deleteTeamMember:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du membre.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};