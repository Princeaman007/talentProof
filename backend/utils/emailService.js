/**
 * ═══════════════════════════════════════════════════════════════════════
 * TALENTPROOF - SERVICE D'ENVOI D'EMAILS AVEC VRAIES DONNÉES MONGODB
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * CORRIGÉ - Toutes les fonctions utilisent maintenant les vraies données
 * Dates formatées en français lisible
 * Lieux formatés selon le type (physique/en-ligne/hybride)
 * Places disponibles calculées dynamiquement
 * Validation des données avant envoi
 */

import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Import des templates professionnels
import { 
  confirmationEmailTemplate,
  resetPasswordTemplate,
  talentDayConfirmationTemplate,
  companyNewCandidatureTemplate,
  companyTalentDayRegistrationTemplate,
  contactNotificationTemplate,
  contactConfirmationTemplate,
  generalContactNotificationTemplate,
  generalContactConfirmationTemplate,
  talentDayAcceptationTemplate,
  talentDayRefusTemplate
} from './emailTemplates.professional.js';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION NODEMAILER
// ═══════════════════════════════════════════════════════════════════════

const createTransporter = () => {
  const emailPort = parseInt(process.env.EMAIL_PORT);
  const isSSL = emailPort === 465;

  return createTransport({
    host: process.env.EMAIL_HOST,
    port: emailPort,
    secure: isSSL,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
    pool: false,
  });
};

/**
 * Fonction principale d'envoi d'email
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.SKIP_EMAILS === 'true') {
    return { success: true, messageId: 'dev-mode-skipped' };
  }

  try {
    const transporter = createTransporter();

    try {
      await transporter.verify();
    } catch (verifyError) {
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TalentProof <info@princeaman.dev>',
      to,
      subject,
      html,
      text: text || '',
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Formate une date MongoDB en français lisible
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée (ex: "Lundi 15 janvier 2025 à 09:00")
 */
const formatDateFR = (date) => {
  if (!date) return 'Date à confirmer';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Date à confirmer';
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Date à confirmer';
  }
};

/**
 * Formate le lieu d'un événement selon son type
 * @param {Object} location - Objet location du TalentDay
 * @returns {Object} Objet avec toutes les infos de lieu formatées
 */
const formatLocation = (location) => {
  const defaultLocation = {
    type: 'À confirmer',
    address: '',
    city: '',
    postalCode: '',
    instructions: '',
    formatted: 'Lieu à confirmer'
  };
  
  if (!location || !location.type) {
    return defaultLocation;
  }
  
  if (location.type === 'physique') {
    return {
      type: 'physique',
      address: location.address || location.adresse || '',
      city: location.city || location.ville || '',
      postalCode: location.postalCode || location.codePostal || '',
      instructions: location.instructions || '',
      formatted: location.address 
        ? `${location.address}, ${location.postalCode || ''} ${location.city || ''}`.trim()
        : 'Adresse à confirmer'
    };
  } else if (location.type === 'en-ligne') {
    return {
      type: 'en-ligne',
      address: '',
      city: '',
      postalCode: '',
      instructions: location.instructions || '',
      formatted: 'En ligne (lien fourni 24h avant l\'événement)'
    };
  } else if (location.type === 'hybride') {
    return {
      type: 'hybride',
      address: location.address || location.adresse || '',
      city: location.city || location.ville || '',
      postalCode: location.postalCode || location.codePostal || '',
      instructions: location.instructions || '',
      formatted: `Hybride - ${location.city || location.ville || 'Lieu à confirmer'}`
    };
  }
  
  return defaultLocation;
};

/**
 * Calcule les places disponibles pour un événement
 * @param {Object} talentDay - Objet TalentDay de MongoDB
 * @returns {Object} { availableSpots, totalSpots, percentage }
 */
const calculateAvailableSpots = (talentDay) => {
  if (!talentDay) {
    return { availableSpots: 0, totalSpots: 0, percentage: 0 };
  }
  
  const totalSpots = talentDay.maxParticipants || talentDay.placesDisponibles || 0;
  const inscriptionsCount = talentDay.inscriptions ? talentDay.inscriptions.length : 0;
  const availableSpots = Math.max(0, totalSpots - inscriptionsCount);
  const percentage = totalSpots > 0 ? Math.round((inscriptionsCount / totalSpots) * 100) : 0;
  
  return { availableSpots, totalSpots, percentage };
};

/**
 * Valide les données d'un TalentDay avant envoi email
 * @param {Object} talentDay - Objet TalentDay de MongoDB
 * @throws {Error} Si données critiques manquantes
 */
const validateTalentDayData = (talentDay) => {
  if (!talentDay) {
    throw new Error('TalentDay manquant');
  }
  
  if (!talentDay.titre) {
    throw new Error(`Titre manquant pour TalentDay ${talentDay._id}`);
  }
  
  if (!talentDay.date) {
    throw new Error(`Date manquante pour TalentDay ${talentDay._id}`);
  }
  
  if (!talentDay.location && !talentDay.lieu) {
  }
  
  if (!talentDay.maxParticipants && !talentDay.placesDisponibles) {
  }
};

/**
 * Formate les horaires d'un événement
 * @param {string} heureDebut - Heure de début (format "HH:MM")
 * @param {string} heureFin - Heure de fin (format "HH:MM")
 * @returns {string} Horaires formatés
 */
const formatHoraires = (heureDebut, heureFin) => {
  if (!heureDebut || !heureFin) return 'Horaires à confirmer';
  return `${heureDebut} - ${heureFin}`;
};

// ═══════════════════════════════════════════════════════════════════════
// 1. EMAIL DE BIENVENUE ENTREPRISE AVEC CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Envoie un email de bienvenue avec lien de confirmation à une entreprise
 * @param {Object} company - Objet entreprise de MongoDB
 * @param {string} confirmationToken - Token de confirmation
 */
export const sendWelcomeCompanyEmail = async (company, confirmationToken) => {
  if (!company || !company.email) {
    throw new Error('Email entreprise manquant pour email de bienvenue');
  }
  
  if (!confirmationToken) {
    throw new Error('Token de confirmation manquant');
  }
  
  const companyName = company.companyName || company.nomEntreprise || company.nom || 'Entreprise';
  const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/confirm-email/${confirmationToken}`;
  
  const html = confirmationEmailTemplate(companyName, confirmationLink);
  
  return sendEmail({
    to: company.email,
    subject: `Bienvenue sur TalentProof, ${companyName} !`,
    html,
    text: `Bienvenue ${companyName} ! Confirmez votre email en cliquant sur ce lien: ${confirmationLink}`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 2. EMAIL DE RÉINITIALISATION MOT DE PASSE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {Object} user - Utilisateur (talent ou entreprise)
 * @param {string} resetToken - Token de réinitialisation
 */
export const sendResetPasswordEmail = async (user, resetToken) => {
  if (!user || !user.email) {
    throw new Error('Email utilisateur manquant pour reset password');
  }
  
  if (!resetToken) {
    throw new Error('Token de réinitialisation manquant');
  }
  
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;
  const userName = user.companyName || user.nomEntreprise || user.prenom || user.nom || 'Utilisateur';
  
  const html = resetPasswordTemplate(userName, resetLink);
  
  return sendEmail({
    to: user.email,
    subject: `Réinitialisation de votre mot de passe - TalentProof`,
    html,
    text: `Bonjour ${userName}, cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}. Ce lien expire dans 1 heure.`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 3. EMAIL DE CONFIRMATION INSCRIPTION TALENTDAY (POUR LE TALENT)
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Envoie toutes les vraies données MongoDB
 * @param {Object} talent - Objet talent de MongoDB
 * @param {Object} talentDay - Objet TalentDay complet de MongoDB
 * @param {Object} inscription - Données de l'inscription
 */
export const sendTalentDayConfirmationEmail = async (talent, talentDay, inscription) => {
  // VALIDATION STRICTE
  if (!talent || !talent.email) {
    throw new Error('Email talent manquant pour confirmation inscription');
  }
  
  validateTalentDayData(talentDay);
  
  // EXTRACTION DES VRAIES DONNÉES MONGODB
  const talentName = `${talent.prenom || talent.firstName || ''} ${talent.nom || talent.lastName || ''}`.trim();
  
  // FORMATAGE DU LIEU SELON LE TYPE
  const locationData = formatLocation(talentDay.location || talentDay.lieu);
  
  // CALCUL DYNAMIQUE DES PLACES DISPONIBLES
  const { availableSpots, totalSpots } = calculateAvailableSpots(talentDay);
  
  // FORMATAGE DE LA DATE EN FRANÇAIS
  const eventDate = formatDateFR(talentDay.date);
  
  // FORMATAGE DES HORAIRES
  const horaires = formatHoraires(talentDay.heureDebut, talentDay.heureFin);
  
  // CONSTRUCTION DE L'OBJET INSCRIPTION FORMATÉ
  const inscriptionFormatted = {
    prenom: talent.prenom || talent.firstName || 'Talent',
    nom: talent.nom || talent.lastName || '',
    email: talent.email,
    telephone: talent.telephone || talent.phone || inscription?.telephone || 'Non renseigné',
    technologies: talent.technologies || inscription?.technologies || []
  };
  
  // CONSTRUCTION DE L'OBJET TALENTDAY COMPLET AVEC TOUTES LES DONNÉES
  const talentDayFormatted = {
    _id: talentDay._id,
    titre: talentDay.titre || talentDay.title || 'TalentDay',
    description: talentDay.description || 'Description à venir',
    date: talentDay.date,
    lieu: locationData.formatted, // Lieu formaté selon le type
    horaires: horaires, // Horaires formatés
    maxParticipants: totalSpots,
    inscriptions: talentDay.inscriptions || []
  };
  
  // GÉNÉRATION DU HTML AVEC LE TEMPLATE PROFESSIONNEL
  const html = talentDayConfirmationTemplate(inscriptionFormatted, talentDayFormatted);
  
  return sendEmail({
    to: talent.email,
    subject: `Inscription confirmée - ${talentDay.titre}`,
    html,
    text: `Bonjour ${talentName}, votre inscription au TalentDay "${talentDay.titre}" le ${eventDate} est confirmée. Places restantes: ${availableSpots}/${totalSpots}. Lieu: ${locationData.formatted}. Horaires: ${horaires}`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 4. EMAIL DE NOTIFICATION À L'ENTREPRISE (NOUVELLE CANDIDATURE)
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Notifie l'entreprise avec toutes les données du talent
 * @param {Object} talent - Objet talent complet de MongoDB
 * @param {Object} talentDay - Objet TalentDay complet de MongoDB
 * @param {Object} inscription - Données de l'inscription
 */
export const sendNewApplicationEmail = async (talent, talentDay, inscription) => {
  // VALIDATION
  if (!talent || !talent.email) {
    throw new Error('Email talent manquant pour notification entreprise');
  }
  
  validateTalentDayData(talentDay);
  
  // EMAIL DE DESTINATION (organisateur ou admin)
  const companyEmail = talentDay.organisateur?.email || 
                       talentDay.infoEntreprises?.contact?.email || 
                       talentDay.createdBy?.email ||
                       process.env.ADMIN_EMAIL || 
                       'info@princeaman.dev';
  
  const companyName = talentDay.organisateur?.nom || 
                     talentDay.infoEntreprises?.nom || 
                     'Organisateur';
  
  // CALCUL DYNAMIQUE DES PLACES
  const { availableSpots, totalSpots } = calculateAvailableSpots(talentDay);
  
  // FORMATAGE DU LIEU
  const locationData = formatLocation(talentDay.location || talentDay.lieu);
  
  // FORMATAGE DE LA DATE
  const eventDate = formatDateFR(talentDay.date);
  
  // FORMATAGE DES HORAIRES
  const horaires = formatHoraires(talentDay.heureDebut, talentDay.heureFin);
  
  // CONSTRUCTION DE L'OBJET TALENT COMPLET
  const talentInfo = {
    prenom: talent.prenom || talent.firstName || 'Talent',
    nom: talent.nom || talent.lastName || '',
    email: talent.email,
    telephone: talent.telephone || talent.phone || inscription?.telephone || 'Non renseigné',
    technologies: talent.technologies || inscription?.technologies || [],
    scoreTest: talent.scoreTest || null,
    plateforme: talent.plateforme || 'TalentProof',
    motivation: inscription?.motivation || inscription?.message || '',
    linkedin: talent.linkedin || talent.linkedinUrl || null,
    github: talent.github || talent.githubUrl || null,
    portfolio: talent.portfolio || talent.portfolioUrl || null
  };
  
  // CONSTRUCTION DE L'OBJET TALENTDAY COMPLET
  const talentDayFormatted = {
    _id: talentDay._id,
    titre: talentDay.titre || talentDay.title || 'TalentDay',
    date: talentDay.date,
    lieu: locationData.formatted,
    horaires: horaires,
    inscriptions: talentDay.inscriptions || [],
    maxParticipants: totalSpots
  };
  
  // GÉNÉRATION DU HTML
  const html = companyNewCandidatureTemplate(talentInfo, talentDayFormatted);
  
  return sendEmail({
    to: companyEmail,
    subject: `Nouvelle candidature - ${talentInfo.prenom} ${talentInfo.nom} pour ${talentDay.titre}`,
    html,
    text: `Nouvelle candidature de ${talentInfo.prenom} ${talentInfo.nom} (${talentInfo.email}, tel: ${talentInfo.telephone}) pour votre TalentDay "${talentDay.titre}" le ${eventDate}. Technologies: ${talentInfo.technologies.join(', ')}. Score: ${talentInfo.scoreTest || 'N/A'}. Inscriptions: ${talentDay.inscriptions?.length || 0}/${totalSpots}. Lieu: ${locationData.formatted}`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 5. EMAIL D'INSCRIPTION ENTREPRISE À UN TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Confirme l'inscription d'une entreprise à un/des TalentDay(s)
 * @param {Object} companyInfo - Informations de l'entreprise
 * @param {Array} talentDays - Array d'objets TalentDay complets de MongoDB
 */
export const sendCompanyTalentDayRegistrationEmail = async (companyInfo, talentDays) => {
  if (!companyInfo || !companyInfo.email) {
    throw new Error('Email entreprise manquant pour confirmation inscription');
  }
  
  if (!talentDays || talentDays.length === 0) {
    throw new Error('Aucun TalentDay fourni pour confirmation');
  }
  
  // FORMATAGE DES TALENTDAYS AVEC TOUTES LES DONNÉES
  const formattedTalentDays = talentDays.map(td => {
    validateTalentDayData(td);
    
    const locationData = formatLocation(td.location || td.lieu);
    const { availableSpots, totalSpots } = calculateAvailableSpots(td);
    const eventDate = formatDateFR(td.date);
    const horaires = formatHoraires(td.heureDebut, td.heureFin);
    
    return {
      _id: td._id,
      titre: td.titre || td.title || 'TalentDay',
      description: td.description || 'Description à venir',
      date: td.date,
      dateFormatted: eventDate,
      lieu: locationData, // Objet complet avec type, address, city, formatted
      horaires: horaires,
      availableSpots: availableSpots,
      totalSpots: totalSpots
    };
  });
  
  // GÉNÉRATION DU HTML
  const html = companyTalentDayRegistrationTemplate(companyInfo, formattedTalentDays);
  
  const talentDaysTitles = formattedTalentDays.map(td => td.titre).join(', ');
  
  return sendEmail({
    to: companyInfo.email,
    subject: `Inscription TalentDay(s) bien reçue - ${companyInfo.companyName || companyInfo.nomEntreprise}`,
    html,
    text: `Bonjour ${companyInfo.contactPerson || 'Responsable'}, votre inscription aux TalentDays (${talentDaysTitles}) a bien été reçue. Notre équipe va la valider sous 24-48h.`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 6. EMAIL DE NOTIFICATION CONTACT TALENT (ENTREPRISE → ADMIN)
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Notifie l'admin qu'une entreprise souhaite contacter un talent
 * @param {Object} talentInfo - Informations complètes du talent
 * @param {Object} recruteurInfo - Informations complètes du recruteur
 */
export const sendContactTalentNotificationEmail = async (talentInfo, recruteurInfo) => {
  if (!talentInfo || !talentInfo.prenom) {
    throw new Error('Données talent manquantes pour notification contact');
  }
  
  if (!recruteurInfo || !recruteurInfo.email) {
    throw new Error('Données recruteur manquantes pour notification contact');
  }
  
  const adminEmail = process.env.ADMIN_EMAIL || 'info@princeaman.dev';
  
  const html = contactNotificationTemplate(talentInfo, recruteurInfo);
  
  return sendEmail({
    to: adminEmail,
    subject: `Demande de contact - ${recruteurInfo.entreprise} → ${talentInfo.prenom}`,
    html,
    text: `${recruteurInfo.entreprise} (${recruteurInfo.email}, ${recruteurInfo.tel}) souhaite contacter le talent ${talentInfo.prenom} (technologies: ${talentInfo.technologies?.join(', ')}). Message: ${recruteurInfo.message}`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 7. EMAIL DE CONFIRMATION CONTACT (RECRUTEUR)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Confirme au recruteur que sa demande de contact a été reçue
 * @param {string} recruteurNom - Nom du recruteur
 * @param {string} recruteurEmail - Email du recruteur
 * @param {string} talentPrenom - Prénom du talent
 */
export const sendContactConfirmationToRecruiterEmail = async (recruteurNom, recruteurEmail, entreprise, talentPrenom) => {
  if (!recruteurEmail) {
    throw new Error('Email recruteur manquant pour confirmation contact');
  }
  
  const html = contactConfirmationTemplate(recruteurNom, entreprise, talentPrenom);
  
  return sendEmail({
    to: recruteurEmail,
    subject: `Confirmation : Votre demande de contact pour ${talentPrenom} - TalentProof`,
    html,
    text: `Bonjour ${recruteurNom}, votre demande de contact de la part de ${entreprise} pour le talent ${talentPrenom} a bien été reçue. Nous vous recontacterons sous 48h avec les informations complètes.`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 8. EMAIL DE CONTACT GÉNÉRAL - NOTIFICATION (À ADMIN)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Notifie l'admin d'un message via le formulaire de contact général
 * @param {Object} contactInfo - Informations du contact
 */
export const sendGeneralContactNotificationEmail = async (contactInfo) => {
  if (!contactInfo || !contactInfo.email) {
    throw new Error('Email contact manquant pour notification');
  }
  
  const adminEmail = process.env.ADMIN_EMAIL || 'info@princeaman.dev';
  
  const html = generalContactNotificationTemplate(contactInfo);
  
  return sendEmail({
    to: adminEmail,
    subject: `Nouveau message de contact - ${contactInfo.sujet}`,
    html,
    text: `Nouveau message de ${contactInfo.nom} (${contactInfo.email}). Sujet: ${contactInfo.sujet}. Message: ${contactInfo.message}`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 9. EMAIL DE CONTACT GÉNÉRAL - CONFIRMATION (AU VISITEUR)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Confirme au visiteur que son message a été reçu
 * @param {string} nom - Nom du visiteur
 * @param {string} email - Email du visiteur
 */
export const sendGeneralContactConfirmationEmail = async (nom, email) => {
  if (!email) {
    throw new Error('Email visiteur manquant pour confirmation contact');
  }
  
  const html = generalContactConfirmationTemplate(nom);
  
  return sendEmail({
    to: email,
    subject: `Message bien reçu - TalentProof`,
    html,
    text: `Bonjour ${nom}, merci pour votre message. Notre équipe vous répondra sous 24-48h.`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 10. EMAIL D'ACCEPTATION TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Notifie le talent que sa candidature a été acceptée
 * @param {Object} inscription - Objet inscription de MongoDB
 * @param {Object} talentDay - Objet TalentDay complet de MongoDB
 */
export const sendTalentDayAcceptationEmail = async (inscription, talentDay) => {
  if (!inscription || !inscription.email) {
    throw new Error('Email inscription manquant pour acceptation');
  }
  
  validateTalentDayData(talentDay);
  
  const locationData = formatLocation(talentDay.location || talentDay.lieu);
  const { availableSpots, totalSpots } = calculateAvailableSpots(talentDay);
  const eventDate = formatDateFR(talentDay.date);
  const horaires = formatHoraires(talentDay.heureDebut, talentDay.heureFin);
  
  const talentDayFormatted = {
    _id: talentDay._id,
    titre: talentDay.titre || talentDay.title || 'TalentDay',
    description: talentDay.description || 'Description à venir',
    date: talentDay.date,
    lieu: locationData.formatted,
    horaires: horaires,
    inscriptions: talentDay.inscriptions || [],
    maxParticipants: totalSpots
  };
  
  const html = talentDayAcceptationTemplate(inscription, talentDayFormatted);
  
  return sendEmail({
    to: inscription.email,
    subject: `Candidature acceptée - ${talentDay.titre}`,
    html,
    text: `Félicitations ${inscription.prenom} ! Votre candidature au TalentDay "${talentDay.titre}" le ${eventDate} a été acceptée. Lieu: ${locationData.formatted}. Horaires: ${horaires}.`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// 11. EMAIL DE REFUS TALENTDAY
// ═══════════════════════════════════════════════════════════════════════

/**
 * FONCTION CORRIGÉE - Notifie le talent que sa candidature n'a pas été retenue
 * @param {Object} inscription - Objet inscription de MongoDB
 * @param {Object} talentDay - Objet TalentDay complet de MongoDB
 * @param {string} raison - Raison du refus (optionnel)
 */
export const sendTalentDayRefusEmail = async (inscription, talentDay, raison = null) => {
  if (!inscription || !inscription.email) {
    throw new Error('Email inscription manquant pour refus');
  }
  
  validateTalentDayData(talentDay);
  
  const talentDayFormatted = {
    _id: talentDay._id,
    titre: talentDay.titre || talentDay.title || 'TalentDay'
  };
  
  const html = talentDayRefusTemplate(inscription, talentDayFormatted, raison);
  
  return sendEmail({
    to: inscription.email,
    subject: `Votre candidature au TalentDay - ${talentDay.titre}`,
    html,
    text: `Bonjour ${inscription.prenom}, malheureusement votre candidature au TalentDay "${talentDay.titre}" n'a pas été retenue. ${raison ? `Raison: ${raison}.` : ''} Nous vous encourageons à postuler à nos prochains événements !`
  });
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS COMPLÉMENTAIRES
// ═══════════════════════════════════════════════════════════════════════

export {
  formatDateFR,
  formatLocation,
  calculateAvailableSpots,
  validateTalentDayData,
  formatHoraires
};

// ═══════════════════════════════════════════════════════════════════════
// FIN DU FICHIER - TOUTES LES FONCTIONS SONT CORRIGÉES
// ═══════════════════════════════════════════════════════════════════════
