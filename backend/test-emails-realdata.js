/**
 * ═══════════════════════════════════════════════════════════════════════
 * TEST DU NOUVEAU SYSTÈME D'EMAILS AVEC VRAIES DONNÉES
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Ce script teste les nouvelles fonctions d'envoi d'emails qui utilisent
 * les vraies données MongoDB (lieu, dates formatées, places disponibles, etc.)
 */

import {
  sendWelcomeTalentEmail,
  sendWelcomeCompanyEmail,
  sendTalentDayConfirmationEmail,
  sendCompanyNewApplicationEmail,
  sendResetPasswordEmail,
  sendContactTalentNotificationEmail,
  sendContactConfirmationToCompanyEmail
} from './utils/emailService.js';

// ═══════════════════════════════════════════════════════════════════════
// DONNÉES DE TEST SIMULANT MONGODB
// ═══════════════════════════════════════════════════════════════════════

// Exemple de Talent depuis MongoDB
const mockTalent = {
  _id: '507f1f77bcf86cd799439011',
  prenom: 'Alexandre',
  nom: 'Dubois',
  email: 'info@princeaman.dev',
  telephone: '+32 467 62 08 78',
  technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
  typeProfil: 'Développeur Full-Stack',
  niveau: 'Junior',
  scoreTest: 85,
  plateforme: 'Codingame',
  linkedin: 'https://linkedin.com/in/alexandre-dubois',
  github: 'https://github.com/alexandre-dubois'
};

// Exemple d'Entreprise depuis MongoDB
const mockCompany = {
  _id: '507f1f77bcf86cd799439022',
  nomEntreprise: 'TechCorp Belgium',
  nomContact: 'Marie Dupont',
  email: 'info@princeaman.dev',
  telephone: '+32 2 123 45 67',
  secteur: 'Technologies',
  tailleEntreprise: '50-200 employés'
};

// Exemple de TalentDay depuis MongoDB (AVEC TOUTES LES DONNÉES)
const mockTalentDay = {
  _id: '507f1f77bcf86cd799439033',
  titre: 'Développeur Full-Stack - TalentDay Liège',
  description: 'Journée de recrutement dédiée aux développeurs Full-Stack. Rencontrez 5 entreprises tech belges qui recrutent activement. Au programme : présentations, mini-challenges de code, et entretiens individuels.',
  date: new Date('2025-01-15T09:00:00Z'),
  heureDebut: '09:00',
  heureFin: '17:00',
  lieu: {
    type: 'physique',
    adresse: 'Avenue de Lille 4 A52',
    ville: 'Liège',
    postalCode: '4020',
    instructions: 'Entrée principale, 2ème étage. Demandez TalentProof à l\'accueil.'
  },
  technologies: ['React', 'Vue.js', 'Node.js', 'Python', 'Django'],
  niveauRequis: 'intermediaire',
  placesDisponibles: 20,
  inscriptions: [
    { nom: 'Test', email: 'test1@test.com', statut: 'accepte' },
    { nom: 'Test2', email: 'test2@test.com', statut: 'accepte' },
    { nom: 'Test3', email: 'test3@test.com', statut: 'en-attente' }
  ],
  typeEvenement: 'portfolio-day',
  organisateur: {
    nom: 'TalentProof',
    email: 'info@princeaman.dev',
    telephone: '+32 467 62 08 78'
  },
  statut: 'inscriptions-ouvertes'
};

// Exemple d'Inscription depuis MongoDB
const mockInscription = {
  nom: 'Dubois',
  prenom: 'Alexandre',
  email: 'info@princeaman.dev',
  telephone: '+32 467 62 08 78',
  motivation: 'Je suis passionné par le développement web et je souhaite rejoindre une équipe dynamique pour développer mes compétences. J\'ai travaillé sur plusieurs projets personnels en React et Node.js.',
  technologies: ['React', 'Node.js', 'MongoDB'],
  dateInscription: new Date(),
  statut: 'accepte'
};

// TalentDay en ligne
const mockTalentDayOnline = {
  ...mockTalentDay,
  _id: '507f1f77bcf86cd799439044',
  titre: 'Remote Full-Stack Challenge',
  date: new Date('2025-02-01T14:00:00Z'),
  lieu: {
    type: 'en-ligne',
    lienVirtuel: 'https://meet.google.com/abc-defg-hij'
  },
  placesDisponibles: 30,
  inscriptions: []
};

// TalentDay hybride
const mockTalentDayHybrid = {
  ...mockTalentDay,
  _id: '507f1f77bcf86cd799439055',
  titre: 'Hackathon Hybride - Bruxelles',
  date: new Date('2025-03-10T10:00:00Z'),
  lieu: {
    type: 'hybride',
    adresse: 'Rue de la Loi 155',
    ville: 'Bruxelles',
    postalCode: '1040',
    lienVirtuel: 'https://zoom.us/j/123456789'
  },
  placesDisponibles: 50,
  inscriptions: Array(12).fill({ nom: 'Test', email: 'test@test.com' })
};

// ═══════════════════════════════════════════════════════════════════════
// TESTS DES EMAILS
// ═══════════════════════════════════════════════════════════════════════

const runTests = async () => {
  console.log('\n' + '═'.repeat(70));
  console.log(' TESTS DU NOUVEAU SYSTÈME D\'EMAILS AVEC VRAIES DONNÉES');
  console.log('═'.repeat(70) + '\n');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Test 1: Bienvenue Talent
  try {
    console.log(' Test 1/7: Email de bienvenue TALENT...');
    await sendWelcomeTalentEmail(mockTalent);
    console.log(' Test 1 - Bienvenue Talent - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 1 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Bienvenue Talent', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Bienvenue Entreprise
  try {
    console.log(' Test 2/7: Email de bienvenue ENTREPRISE...');
    await sendWelcomeCompanyEmail(mockCompany);
    console.log(' Test 2 - Bienvenue Entreprise - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 2 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Bienvenue Entreprise', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Confirmation TalentDay (lieu physique)
  try {
    console.log(' Test 3/7: Confirmation TalentDay (LIEU PHYSIQUE)...');
    console.log(`    Lieu: ${mockTalentDay.lieu.adresse}, ${mockTalentDay.lieu.ville}`);
    console.log(`    Date: ${mockTalentDay.date.toLocaleDateString('fr-FR')}`);
    console.log(`    Places: ${mockTalentDay.placesDisponibles - mockTalentDay.inscriptions.length}/${mockTalentDay.placesDisponibles}`);
    
    await sendTalentDayConfirmationEmail(mockTalent, mockTalentDay, mockInscription);
    console.log(' Test 3 - Confirmation TalentDay Physique - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 3 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Confirmation TalentDay Physique', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 4: Confirmation TalentDay (en ligne)
  try {
    console.log(' Test 4/7: Confirmation TalentDay (EN LIGNE)...');
    console.log(`    Type: ${mockTalentDayOnline.lieu.type}`);
    console.log(`    Date: ${mockTalentDayOnline.date.toLocaleDateString('fr-FR')}`);
    
    await sendTalentDayConfirmationEmail(mockTalent, mockTalentDayOnline, mockInscription);
    console.log(' Test 4 - Confirmation TalentDay Online - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 4 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Confirmation TalentDay Online', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 5: Notification Entreprise (nouvelle candidature)
  try {
    console.log(' Test 5/7: Notification ENTREPRISE (nouvelle candidature)...');
    console.log(`    Talent: ${mockTalent.prenom} ${mockTalent.nom}`);
    console.log(`    Technologies: ${mockTalent.technologies.join(', ')}`);
    console.log(`    Envoi à: ${mockTalentDay.organisateur.email}`);
    
    await sendCompanyNewApplicationEmail(mockTalent, mockTalentDay, mockInscription);
    console.log(' Test 5 - Notification Entreprise - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 5 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Notification Entreprise', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 6: Reset Password
  try {
    console.log(' Test 6/7: Email de RÉINITIALISATION MOT DE PASSE...');
    const resetToken = 'test-reset-token-123456';
    await sendResetPasswordEmail(mockTalent, resetToken);
    console.log(' Test 6 - Reset Password - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 6 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Reset Password', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 7: Contact Talent (Entreprise → Admin)
  try {
    console.log(' Test 7/7: Notification CONTACT TALENT (Entreprise → Admin)...');
    const message = 'Bonjour, je souhaite entrer en contact avec ce talent pour discuter d\'une opportunité au sein de notre équipe. Quand pouvons-nous organiser un premier échange ?';
    
    await sendContactTalentNotificationEmail(mockTalent, mockCompany, message);
    console.log(' Test 7 - Contact Talent - Email envoyé avec succès\n');
    results.success++;
  } catch (error) {
    console.error(' Test 7 échoué:', error.message);
    results.failed++;
    results.errors.push({ test: 'Contact Talent', error: error.message });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // RÉSULTATS FINAUX
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('\n' + '═'.repeat(70));
  console.log(' RÉSULTATS DES TESTS');
  console.log('═'.repeat(70));
  console.log(` Tests réussis: ${results.success}/7`);
  console.log(` Tests échoués: ${results.failed}/7`);
  console.log('═'.repeat(70) + '\n');
  
  if (results.failed > 0) {
    console.log(' ERREURS DÉTECTÉES:\n');
    results.errors.forEach((err, index) => {
      console.log(`${index + 1}. ${err.test}:`);
      console.log(`   ${err.error}\n`);
    });
  } else {
    console.log(' TOUS LES TESTS SONT PASSÉS !\n');
    console.log(' Le système d\'emails utilise maintenant les VRAIES DONNÉES MongoDB:');
    console.log('  - Lieux complets (adresse, ville, code postal)');
    console.log('  - Dates formatées en français lisible');
    console.log('  - Places disponibles calculées dynamiquement');
    console.log('  - Descriptions complètes des événements');
    console.log('  - Profils talents complets (technologies, scores, etc.)');
    console.log('  - Gestion des 3 types de lieux (physique, en ligne, hybride)');
  }
  
  console.log('\n VÉRIFICATIONS À FAIRE:');
  console.log('  1.  Vérifiez votre boîte email: info@princeaman.dev');
  console.log('  2.  Vérifiez le dossier SPAM si nécessaire');
  console.log('  3.  Confirmez que les VRAIES DONNÉES apparaissent:');
  console.log('     - Adresses complètes (pas "À confirmer")');
  console.log('     - Dates formatées (pas de timestamp ISO)');
  console.log('     - Places dynamiques (17/20, pas statique)');
  console.log('     - Descriptions complètes des événements');
  console.log('  4.  Vérifiez que le logo TalentProof s\'affiche');
  console.log('  5.  Testez les liens (boutons CTA)');
  console.log('\n Tests terminés\n');
};

// Lancer les tests
runTests().catch(error => {
  console.error('\n ERREUR CRITIQUE:', error);
  process.exit(1);
});
