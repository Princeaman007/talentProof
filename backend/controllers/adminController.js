import Talent from '../models/Talent.js';
import ContactRequest from '../models/ContactRequest.js';

/**
 * @route   POST /api/admin/talents
 * @desc    Créer un nouveau talent
 * @access  Private/Admin
 */
export const createTalent = async (req, res) => {
  try {
    const { prenom, photo, technologies, competences, scoreTest, plateforme, anneeExperience, statut } = req.body;

    const talent = await Talent.create({
      prenom,
      photo,
      technologies,
      competences,
      scoreTest,
      plateforme,
      anneeExperience,
      statut: statut || 'actif',
    });

    res.status(201).json({
      success: true,
      message: 'Talent créé avec succès.',
      data: talent,
    });
  } catch (error) {
    console.error('Erreur createTalent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/talents
 * @desc    Obtenir tous les talents (actifs + inactifs) pour admin
 * @access  Private/Admin
 */
export const getAllTalentsAdmin = async (req, res) => {
  try {
    const talents = await Talent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: talents.length,
      data: talents,
    });
  } catch (error) {
    console.error('Erreur getAllTalentsAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des talents.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/talents/:id
 * @desc    Modifier un talent
 * @access  Private/Admin
 */
export const updateTalent = async (req, res) => {
  try {
    const { prenom, photo, technologies, competences, scoreTest, plateforme, anneeExperience, statut } = req.body;

    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    // Mettre à jour les champs
    if (prenom) talent.prenom = prenom;
    if (photo !== undefined) talent.photo = photo;
    if (technologies) talent.technologies = technologies;
    if (competences) talent.competences = competences;
    if (scoreTest !== undefined) talent.scoreTest = scoreTest;
    if (plateforme) talent.plateforme = plateforme;
    if (anneeExperience) talent.anneeExperience = anneeExperience;
    if (statut) talent.statut = statut;

    await talent.save();

    res.status(200).json({
      success: true,
      message: 'Talent mis à jour avec succès.',
      data: talent,
    });
  } catch (error) {
    console.error('Erreur updateTalent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   DELETE /api/admin/talents/:id
 * @desc    Supprimer un talent
 * @access  Private/Admin
 */
export const deleteTalent = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    await talent.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Talent supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur deleteTalent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/contact-requests
 * @desc    Obtenir toutes les demandes de contact
 * @access  Private/Admin
 */
export const getAllContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find()
      .populate('talent', 'prenom technologies scoreTest')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Erreur getAllContactRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/contact-requests/:id
 * @desc    Marquer une demande comme traitée
 * @access  Private/Admin
 */
export const updateContactRequestStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    const request = await ContactRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.',
      });
    }

    request.statut = statut;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Statut mis à jour avec succès.',
      data: request,
    });
  } catch (error) {
    console.error('Erreur updateContactRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};