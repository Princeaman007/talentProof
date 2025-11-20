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

console.log('\n🧪 TEST DU SYSTÈME D\'EMAILS TALENTPROOF\n');
console.log('═'.repeat(60));
console.log(`📧 Email de test: ${TEST_EMAIL}`);
console.log(`🔧 SMTP Host: ${process.env.EMAIL_HOST}`);
console.log(`👤 SMTP User: ${process.env.EMAIL_USER}`);
console.log('═'.repeat(60));

// Fonction pour attendre entre les envois
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour afficher le résultat
const logResult = (testName, success, error = null) => {
  if (success) {
    console.log(`✅ ${testName} - Email envoyé avec succès`);
  } else {
    console.log(`❌ ${testName} - Échec`);
    if (error) {
      console.error(`   Erreur: ${error.message}`);
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════

const runTests = async () => {
  let successCount = 0;
  let failCount = 0;

  console.log('\n🚀 Démarrage des tests...\n');

  // TEST 1: Email de bienvenue - Talent
  console.log('📝 Test 1/5: Email de bienvenue TALENT...');
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
  console.log('📝 Test 2/5: Email de bienvenue ENTREPRISE...');
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
  console.log('📝 Test 3/5: Notification NOUVELLE CANDIDATURE...');
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
  console.log('📝 Test 4/5: Message de CONTACT REÇU...');
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
  console.log('📝 Test 5/5: RÉINITIALISATION MOT DE PASSE...');
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

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('═'.repeat(60));
  console.log(`✅ Tests réussis: ${successCount}/5`);
  console.log(`❌ Tests échoués: ${failCount}/5`);
  console.log('═'.repeat(60));

  if (successCount === 5) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✓ Le système d\'emails fonctionne correctement');
    console.log(`✓ Vérifiez votre boîte email: ${TEST_EMAIL}`);
    console.log('✓ Vérifiez aussi le dossier SPAM si besoin\n');
  } else {
    console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('Vérifiez :');
    console.log('  1. Les variables d\'environnement (.env)');
    console.log('  2. La connexion SMTP (EMAIL_HOST, EMAIL_PORT)');
    console.log('  3. Les identifiants (EMAIL_USER, EMAIL_PASS)');
    console.log('  4. Que SKIP_EMAILS=false\n');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS COMPLÉMENTAIRES
  // ═══════════════════════════════════════════════════════════════════════

  console.log('📝 VÉRIFICATIONS À FAIRE:');
  console.log('  ✓ Logo TalentProof affiché correctement');
  console.log('  ✓ Couleurs bleu (#1E3A8A) présentes');
  console.log('  ✓ Boutons CTA visibles et cliquables');
  console.log('  ✓ Design responsive (testez sur mobile)');
  console.log('  ✓ Footer avec coordonnées complet');
  console.log('  ✓ Texte lisible et bien formaté');
  console.log('');
};

// ═══════════════════════════════════════════════════════════════════════
// LANCEMENT DES TESTS
// ═══════════════════════════════════════════════════════════════════════

runTests()
  .then(() => {
    console.log('✓ Tests terminés\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors des tests:');
    console.error(error);
    process.exit(1);
  });
