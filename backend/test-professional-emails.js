/**
 * ═══════════════════════════════════════════════════════════════════════
 * TEST DES NOUVEAUX TEMPLATES EMAILS PROFESSIONNELS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Ce script teste TOUS les emails avec les nouveaux templates professionnels
 * incluant le logo TalentProof et la charte graphique bleue.
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  confirmationEmailTemplate,
  resetPasswordTemplate,
  contactNotificationTemplate,
  contactConfirmationTemplate,
  generalContactNotificationTemplate,
  generalContactConfirmationTemplate,
  talentDayConfirmationTemplate,
  companyTalentDayRegistrationTemplate
} from './utils/emailTemplates.professional.js';

dotenv.config();

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const TEST_EMAIL = process.env.EMAIL_USER; // Envoyer à soi-même



/**
 * Test 1: Email de confirmation d'inscription
 */
async function test1_confirmationInscription() {
  try {
    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/test-token-abc123`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Confirmez votre inscription sur TalentProof',
      html: confirmationEmailTemplate('Entreprise Test SA', confirmationLink),
    });
    
  } catch (error) {
  }
}

/**
 * Test 2: Email de réinitialisation mot de passe
 */
async function test2_resetPassword() {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/test-reset-xyz789`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Réinitialisation de votre mot de passe - TalentProof',
      html: resetPasswordTemplate('Entreprise Test SA', resetLink),
    });
    
  } catch (error) {
  }
}

/**
 * Test 3: Email de notification contact talent (à Prince)
 */
async function test3_contactTalentNotification() {
  try {
    const talentInfo = {
      prenom: 'Jean',
      technologies: ['JavaScript', 'React', 'Node.js'],
      scoreTest: 85,
      plateforme: 'HackerRank',
      niveau: 'Junior'
    };
    
    const recruteurInfo = {
      nom: 'Marie Dubois',
      email: 'marie.dubois@entreprise.com',
      tel: '+32 467 123 456',
      entreprise: 'Tech Solutions SA',
      message: 'Bonjour,\n\nNous recherchons un développeur JavaScript junior pour un projet de 6 mois.\nLe profil de Jean correspond parfaitement à nos besoins.\n\nPourrions-nous organiser un entretien ?\n\nCordialement,\nMarie'
    };
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST]  Nouvelle demande de contact talent - TalentProof',
      html: contactNotificationTemplate(talentInfo, recruteurInfo),
    });
    
  } catch (error) {
  }
}

/**
 * Test 4: Email de confirmation demande contact (au recruteur)
 */
async function test4_contactConfirmation() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Demande bien reçue ! - TalentProof',
      html: contactConfirmationTemplate('Marie Dubois', 'Jean'),
    });
    
  } catch (error) {
  }
}

/**
 * Test 5: Email de contact général - notification (à Prince)
 */
async function test5_generalContactNotification() {
  try {
    const contactInfo = {
      nom: 'Pierre Martin',
      email: 'pierre.martin@example.com',
      telephone: '+32 467 987 654',
      entreprise: 'StartUp Innovante',
      sujet: 'Partenariat potentiel',
      message: 'Bonjour,\n\nJe suis intéressé par un partenariat avec TalentProof pour former nos nouveaux développeurs.\n\nPourriez-vous me contacter pour en discuter ?\n\nMerci,\nPierre'
    };
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST]  Nouveau message de contact - TalentProof',
      html: generalContactNotificationTemplate(contactInfo),
    });
    
  } catch (error) {
  }
}

/**
 * Test 6: Email de contact général - confirmation (au visiteur)
 */
async function test6_generalContactConfirmation() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Message bien reçu ! - TalentProof',
      html: generalContactConfirmationTemplate('Pierre Martin'),
    });
    
  } catch (error) {
  }
}

/**
 * Test 7: Email de confirmation inscription TalentDay
 */
async function test7_talentDayConfirmation() {
  try {
    const inscription = {
      prenom: 'Sophie',
      nom: 'Lefebvre',
      email: TEST_EMAIL,
      telephone: '+32 467 456 789',
      technologies: ['Python', 'Django', 'PostgreSQL']
    };
    
    const talentDay = {
      _id: '123abc',
      titre: 'TalentDay Python & Web Development',
      date: new Date('2025-12-15T09:00:00'),
      lieu: 'WeWork Brussels Central',
      horaires: '09:00 - 17:00',
      description: 'Rencontrez des entreprises belges qui recrutent des développeurs Python. Au programme : présentations d\'entreprises, speed meetings, ateliers techniques et networking.',
      maxParticipants: 50,
      inscriptions: new Array(23) // 23 inscrits déjà
    };
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Inscription TalentDay confirmée !  - TalentProof',
      html: talentDayConfirmationTemplate(inscription, talentDay),
    });
    
  } catch (error) {
  }
}

/**
 * Test 8: Email inscription entreprise TalentDay
 */
async function test8_companyTalentDayRegistration() {
  try {
    const companyInfo = {
      companyName: 'Tech Innovators SA',
      contactPerson: 'Thomas Durand',
      email: TEST_EMAIL,
      phone: '+32 2 123 45 67',
      website: 'https://tech-innovators.be'
    };
    
    const talentDays = [
      {
        _id: '1',
        titre: 'TalentDay JavaScript',
        date: new Date('2025-11-30T09:00:00'),
        lieu: 'Brussels'
      },
      {
        _id: '2',
        titre: 'TalentDay Python & Data',
        date: new Date('2025-12-15T09:00:00'),
        lieu: 'Liège'
      }
    ];
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: TEST_EMAIL,
      subject: '[TEST] Inscription TalentDay bien reçue !  - TalentProof',
      html: companyTalentDayRegistrationTemplate(companyInfo, talentDays),
    });
    
  } catch (error) {
  }
}

/**
 * Exécution de tous les tests
 */
async function runAllTests() {
  
  // Vérifier la connexion SMTP
  try {
    await transporter.verify();
  } catch (error) {
    process.exit(1);
  }
  
  // Exécuter les tests avec délai entre chaque
  await test1_confirmationInscription();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test2_resetPassword();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test3_contactTalentNotification();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test4_contactConfirmation();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test5_generalContactNotification();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test6_generalContactConfirmation();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test7_talentDayConfirmation();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await test8_companyTalentDayRegistration();
  
}

// Lancer les tests
runAllTests().catch(console.error);
