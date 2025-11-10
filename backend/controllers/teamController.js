import TeamMember from '../models/TeamMember.js';

/**
 * @route   GET /api/team
 * @desc    Obtenir tous les membres de l'équipe
 * @access  Public
 */
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ ordre: 1 });

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
    const { nom, photo, position, specialite, description, linkedIn, twitter, ordre } = req.body;

    const teamMember = await TeamMember.create({
      nom,
      photo,
      position,
      specialite,
      description,
      linkedIn,
      twitter,
      ordre: ordre || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Membre ajouté avec succès.',
      data: teamMember,
    });
  } catch (error) {
    console.error('Erreur createTeamMember:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du membre.',
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
    const { nom, photo, position, specialite, description, linkedIn, twitter, ordre } = req.body;

    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Membre introuvable.',
      });
    }

    // Mettre à jour les champs
    if (nom) teamMember.nom = nom;
    if (photo) teamMember.photo = photo;
    if (position) teamMember.position = position;
    if (specialite) teamMember.specialite = specialite;
    if (description) teamMember.description = description;
    if (linkedIn !== undefined) teamMember.linkedIn = linkedIn;
    if (twitter !== undefined) teamMember.twitter = twitter;
    if (ordre !== undefined) teamMember.ordre = ordre;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Membre mis à jour avec succès.',
      data: teamMember,
    });
  } catch (error) {
    console.error('Erreur updateTeamMember:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du membre.',
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
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Membre introuvable.',
      });
    }

    await teamMember.deleteOne();

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