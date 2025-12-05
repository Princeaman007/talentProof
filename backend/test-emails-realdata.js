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
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Test 1: Bienvenue Talent
  try {
    await sendWelcomeTalentEmail(mockTalent);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Bienvenue Talent', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Bienvenue Entreprise
  try {
    await sendWelcomeCompanyEmail(mockCompany);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Bienvenue Entreprise', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Confirmation TalentDay (lieu physique)
  try {
    
    await sendTalentDayConfirmationEmail(mockTalent, mockTalentDay, mockInscription);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Confirmation TalentDay Physique', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 4: Confirmation TalentDay (en ligne)
  try {
    
    await sendTalentDayConfirmationEmail(mockTalent, mockTalentDayOnline, mockInscription);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Confirmation TalentDay Online', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 5: Notification Entreprise (nouvelle candidature)
  try {
    
    await sendCompanyNewApplicationEmail(mockTalent, mockTalentDay, mockInscription);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Notification Entreprise', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 6: Reset Password
  try {
    const resetToken = 'test-reset-token-123456';
    await sendResetPasswordEmail(mockTalent, resetToken);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Reset Password', error: error.message });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 7: Contact Talent (Entreprise → Admin)
  try {
    const message = 'Bonjour, je souhaite entrer en contact avec ce talent pour discuter d\'une opportunité au sein de notre équipe. Quand pouvons-nous organiser un premier échange ?';
    
    await sendContactTalentNotificationEmail(mockTalent, mockCompany, message);
    results.success++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'Contact Talent', error: error.message });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // RÉSULTATS FINAUX
  // ═══════════════════════════════════════════════════════════════════════
  
  
  if (results.failed > 0) {
    results.errors.forEach((err, index) => {
    });
  } else {
  }
  
};

// Lancer les tests
runTests().catch(error => {
  process.exit(1);
});
