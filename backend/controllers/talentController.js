import Talent from '../models/Talent.js';
import ContactRequest from '../models/ContactRequest.js';
import { sendEmail } from '../utils/email.js';
import { contactNotificationTemplate, contactConfirmationTemplate } from '../utils/emailTemplates.js';

/**
 * @route   GET /api/talents
 * @desc    Obtenir tous les talents actifs
 * @access  Public
 */
export const getAllTalents = async (req, res) => {
  try {
    const talents = await Talent.find({ statut: 'actif' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: talents.length,
      data: talents,
    });
  } catch (error) {
    console.error('Erreur getAllTalents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des talents.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/talents/filter
 * @desc    Filtrer les talents par technologies
 * @access  Public
 */
export const filterTalents = async (req, res) => {
  try {
    const { technologies, minScore, maxScore } = req.query;

    let query = { statut: 'actif' };

    // Filtrer par technologies
    if (technologies) {
      const techArray = technologies.split(',').map(tech => tech.trim());
      query.technologies = { $in: techArray };
    }

    // Filtrer par score
    if (minScore || maxScore) {
      query.scoreTest = {};
      if (minScore) query.scoreTest.$gte = parseInt(minScore);
      if (maxScore) query.scoreTest.$lte = parseInt(maxScore);
    }

    const talents = await Talent.find(query).sort({ scoreTest: -1 });

    res.status(200).json({
      success: true,
      count: talents.length,
      data: talents,
    });
  } catch (error) {
    console.error('Erreur filterTalents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du filtrage des talents.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/talents/:id
 * @desc    Obtenir un talent par ID
 * @access  Public
 */
export const getTalentById = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    if (talent.statut !== 'actif') {
      return res.status(404).json({
        success: false,
        message: 'Ce talent n\'est plus disponible.',
      });
    }

    res.status(200).json({
      success: true,
      data: talent,
    });
  } catch (error) {
    console.error('Erreur getTalentById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/talents/contact
 * @desc    Demander le contact d'un talent (envoie email à Prince)
 * @access  Public
 */
export const contactTalent = async (req, res) => {
  try {
    const { talentId, recruteurNom, recruteurEmail, recruteurTel, entreprise, message } = req.body;

    // Vérifier que le talent existe et est actif
    const talent = await Talent.findById(talentId);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    if (talent.statut !== 'actif') {
      return res.status(400).json({
        success: false,
        message: 'Ce talent n\'est plus disponible.',
      });
    }

    // Créer la demande de contact
    const contactRequest = await ContactRequest.create({
      talent: talentId,
      recruteurNom,
      recruteurEmail,
      recruteurTel,
      entreprise,
      message,
    });

    // Préparer les données pour l'email à Prince
    const talentInfo = {
      prenom: talent.prenom,
      technologies: talent.technologies,
      scoreTest: talent.scoreTest,
      plateforme: talent.plateforme,
    };

    const recruteurInfo = {
      nom: recruteurNom,
      email: recruteurEmail,
      tel: recruteurTel,
      entreprise,
      message,
    };

    // Envoyer l'email de notification à Prince
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@princeaman.dev',
        subject: `[TalentProof] Nouvelle demande de contact pour ${talent.prenom}`,
        html: contactNotificationTemplate(talentInfo, recruteurInfo),
      });
    } catch (emailError) {
      console.error('Erreur envoi email à Prince:', emailError);
    }

    // Envoyer un email de confirmation au recruteur
    try {
      await sendEmail({
        to: recruteurEmail,
        subject: 'Votre demande a été reçue - TalentProof',
        html: contactConfirmationTemplate(recruteurNom, talent.prenom),
      });
    } catch (emailError) {
      console.error('Erreur envoi email au recruteur:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Demande envoyée avec succès ! Nous vous contacterons sous 24-48h.',
      data: contactRequest,
    });
  } catch (error) {
    console.error('Erreur contactTalent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la demande.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};