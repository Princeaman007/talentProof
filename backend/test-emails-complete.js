/**
 * Script de test pour le système d'emails TalentProof
 * 
 * Teste tous les templates d'emails avec des données dynamiques
 * Vérifie que le logo s'affiche correctement
 * 
 * Usage: node test-emails-complete.js
 */

import dotenv from 'dotenv';
import {
  sendWelcomeTalentEmail,
  sendWelcomeCompanyEmail,
  sendNewApplicationEmail,
  sendContactReceivedEmail,
  sendResetPasswordEmail
} from './utils/emailService.js';

dotenv.config();

// Email de test (CHANGEZ CETTE VALEUR)
const TEST_EMAIL = process.env.TEST_EMAIL || 'info@princeaman.dev';


// Fonction pour attendre entre les envois
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour afficher le résultat
const logResult = (testName, success, error = null) => {
  if (success) {
  } else {
    if (error) {
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════

const runTests = async () => {
  let successCount = 0;
  let failCount = 0;


  // TEST 1: Email de bienvenue - Talent
  try {
    await sendWelcomeTalentEmail({
      to: TEST_EMAIL,
      firstName: 'Alexandre',
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login`
    });
    logResult('Test 1 - Bienvenue Talent', true);
    successCount++;
  } catch (error) {
    logResult('Test 1 - Bienvenue Talent', false, error);
    failCount++;
  }

  await wait(2000); // Attendre 2 secondes entre les envois

  // TEST 2: Email de bienvenue - Entreprise
  try {
    await sendWelcomeCompanyEmail({
      to: TEST_EMAIL,
      companyName: 'TechCorp Belgium',
      contactName: 'Marie Dupont',
      dashboardUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard/entreprise`
    });
    logResult('Test 2 - Bienvenue Entreprise', true);
    successCount++;
  } catch (error) {
    logResult('Test 2 - Bienvenue Entreprise', false, error);
    failCount++;
  }

  await wait(2000);

  // TEST 3: Notification nouvelle candidature
  try {
    await sendNewApplicationEmail({
      to: TEST_EMAIL,
      talentName: 'Jean Martin',
      position: 'Développeur Full Stack Junior',
      eventDate: '15 décembre 2025',
      companyName: 'TechCorp',
      talentEmail: 'jean.martin@example.com',
      talentTech: 'React, Node.js, MongoDB, Express'
    });
    logResult('Test 3 - Nouvelle Candidature', true);
    successCount++;
  } catch (error) {
    logResult('Test 3 - Nouvelle Candidature', false, error);
    failCount++;
  }

  await wait(2000);

  // TEST 4: Message de contact reçu
  try {
    await sendContactReceivedEmail({
      to: TEST_EMAIL,
      userName: 'Sophie Leroy',
      userEmail: 'sophie.leroy@example.com',
      message: 'Bonjour,\n\nJe souhaite en savoir plus sur vos services TalentProof.\n\nPouvez-vous me contacter pour discuter d\'une collaboration ?\n\nMerci,\nSophie',
      receivedDate: new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    logResult('Test 4 - Contact Reçu', true);
    successCount++;
  } catch (error) {
    logResult('Test 4 - Contact Reçu', false, error);
    failCount++;
  }

  await wait(2000);

  // TEST 5: Réinitialisation de mot de passe
  try {
    await sendResetPasswordEmail({
      to: TEST_EMAIL,
      userName: 'Pierre Dubois',
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/test-token-123456`
    });
    logResult('Test 5 - Reset Password', true);
    successCount++;
  } catch (error) {
    logResult('Test 5 - Reset Password', false, error);
    failCount++;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RÉSULTATS FINAUX
  // ═══════════════════════════════════════════════════════════════════════


  if (successCount === 5) {
  } else {
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS COMPLÉMENTAIRES
  // ═══════════════════════════════════════════════════════════════════════

};

// ═══════════════════════════════════════════════════════════════════════
// LANCEMENT DES TESTS
// ═══════════════════════════════════════════════════════════════════════

runTests()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });
