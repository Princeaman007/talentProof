import express from 'express';
import { sendEmail } from '../utils/emailService.js';
//  NOUVEAU : Templates professionnels avec logo et charte graphique TalentProof
import { generalContactNotificationTemplate, generalContactConfirmationTemplate } from '../utils/emailTemplates.professional.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Envoyer un message de contact
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { nom, email, telephone, entreprise, sujet, message } = req.body;

    // Validation des champs obligatoires
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires (nom, email, sujet, message)',
      });
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide',
      });
    }

    // Validation longueur du message
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Le message doit contenir au moins 10 caractères',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas dépasser 2000 caractères',
      });
    }

    // Préparer les informations de contact
    const contactInfo = {
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      telephone: telephone?.trim() || null,
      entreprise: entreprise?.trim() || null,
      sujet: sujet.trim(),
      message: message.trim(),
    };

    // 1. Envoyer email de notification à Prince
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@princeaman.dev',
        subject: `[TalentProof Contact] ${contactInfo.sujet}`,
        html: generalContactNotificationTemplate(contactInfo),
      });
      console.log(' Email de notification envoyé à Prince');
    } catch (emailError) {
      console.error(' Erreur envoi email notification:', emailError);
      // On continue quand même pour envoyer la confirmation à l'utilisateur
    }

    // 2. Envoyer email de confirmation à l'expéditeur
    try {
      await sendEmail({
        to: contactInfo.email,
        subject: 'Message bien reçu - TalentProof',
        html: generalContactConfirmationTemplate(contactInfo.nom),
      });
      console.log(' Email de confirmation envoyé à l\'expéditeur');
    } catch (emailError) {
      console.error(' Erreur envoi email confirmation:', emailError);
      // On ne bloque pas la réponse même si l'email de confirmation échoue
    }

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
    });

  } catch (error) {
    console.error(' Erreur dans la route contact:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;