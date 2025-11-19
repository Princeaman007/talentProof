import express from 'express';
import Devis from '../models/Devis.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// POST /api/devis - Créer une nouvelle demande de devis
router.post('/', async (req, res) => {
  try {
    const {
      nomComplet,
      email,
      telephone,
      entreprise,
      typeProjet,
      description,
      fonctionnalites,
      budgetEstime,
      delaiSouhaite
    } = req.body;
    
    // Validation basique
    if (!nomComplet || !email || !telephone || !typeProjet || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }
    
    // Créer la demande de devis
    const nouveauDevis = new Devis({
      nomComplet,
      email,
      telephone,
      entreprise,
      typeProjet,
      description,
      fonctionnalites: fonctionnalites || [],
      budgetEstime,
      delaiSouhaite,
      source: 'site-web'
    });
    
    await nouveauDevis.save();
    
    // Envoyer email de notification à Prince
    const emailContent = `
      <h2> Nouvelle Demande de Devis - TalentProof</h2>
      
      <h3>Informations Client</h3>
      <ul>
        <li><strong>Nom:</strong> ${nomComplet}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Téléphone:</strong> ${telephone}</li>
        ${entreprise ? `<li><strong>Entreprise:</strong> ${entreprise}</li>` : ''}
      </ul>
      
      <h3>Détails du Projet</h3>
      <ul>
        <li><strong>Type:</strong> ${typeProjet}</li>
        <li><strong>Budget estimé:</strong> ${budgetEstime || 'Non spécifié'}</li>
        <li><strong>Délai souhaité:</strong> ${delaiSouhaite || 'Non spécifié'}</li>
      </ul>
      
      <h3>Description</h3>
      <p>${description}</p>
      
      ${fonctionnalites && fonctionnalites.length > 0 ? `
        <h3>Fonctionnalités souhaitées</h3>
        <ul>
          ${fonctionnalites.map(f => `<li>${f}</li>`).join('')}
        </ul>
      ` : ''}
      
      <hr>
      <p><small>Demande reçue le ${new Date().toLocaleString('fr-FR')}</small></p>
      <p><small>ID: ${nouveauDevis._id}</small></p>
    `;
    
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@princeaman.dev',
        subject: `Nouvelle Demande de Devis - ${typeProjet}`,
        html: emailContent
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Ne pas bloquer la création du devis si l'email échoue
    }
    
    // Envoyer email de confirmation au client
    const confirmationEmail = `
      <h2>Merci pour votre demande !</h2>
      
      <p>Bonjour ${nomComplet},</p>
      
      <p>Nous avons bien reçu votre demande de devis pour votre projet <strong>${typeProjet}</strong>.</p>
      
      <p>Notre équipe va étudier votre projet et vous contactera dans les plus brefs délais (généralement sous 24-48h).</p>
      
      <h3>Récapitulatif de votre demande</h3>
      <ul>
        <li><strong>Type de projet:</strong> ${typeProjet}</li>
        <li><strong>Budget estimé:</strong> ${budgetEstime || 'À discuter'}</li>
        <li><strong>Délai souhaité:</strong> ${delaiSouhaite || 'Flexible'}</li>
      </ul>
      
      <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
      <ul>
        <li> Email: info@princeaman.dev</li>
        <li> Téléphone: +32 467 62 08 78</li>
      </ul>
      
      <p>À très bientôt,<br>
      <strong>L'équipe TalentProof</strong></p>
    `;
    
    try {
      await sendEmail({
        to: email,
        subject: 'Confirmation de votre demande de devis - TalentProof',
        html: confirmationEmail
      });
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous 24-48h.',
      data: {
        id: nouveauDevis._id,
        numeroDevis: `DEV-${nouveauDevis._id.toString().slice(-8).toUpperCase()}`
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de votre demande',
      error: error.message
    });
  }
});

// GET /api/devis/types - Obtenir les types de projets disponibles
router.get('/types', (req, res) => {
  const typesProjet = [
    { value: 'site-vitrine', label: 'Site Vitrine', description: 'Présentation de votre entreprise' },
    { value: 'site-e-commerce', label: 'Site E-commerce', description: 'Boutique en ligne' },
    { value: 'application-mobile', label: 'Application Mobile', description: 'iOS et/ou Android' },
    { value: 'application-web', label: 'Application Web', description: 'Plateforme web personnalisée' },
    { value: 'refonte-site', label: 'Refonte de Site', description: 'Moderniser votre site existant' },
    { value: 'maintenance', label: 'Maintenance', description: 'Support et maintenance' },
    { value: 'autre', label: 'Autre', description: 'Projet spécifique' }
  ];
  
  res.json({
    success: true,
    data: typesProjet
  });
});

export default router;