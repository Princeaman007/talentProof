//  SCRIPT DE TEST DES PORTS SMTP INFOMANIAK
// Utilisation : node test-smtp-ports.cjs

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
};

const log = {
  success: (msg) => console.log(`${COLORS.GREEN} ${msg}${COLORS.RESET}`),
  error: (msg) => console.log(`${COLORS.RED} ${msg}${COLORS.RESET}`),
  warn: (msg) => console.log(`${COLORS.YELLOW}  ${msg}${COLORS.RESET}`),
  info: (msg) => console.log(`${COLORS.BLUE}  ${msg}${COLORS.RESET}`),
};

// Configuration des ports à tester
const PORTS_CONFIG = [
  { port: 2525, secure: false, name: 'Port alternatif (RECOMMANDÉ)' },
  { port: 587, secure: false, name: 'STARTTLS standard' },
  { port: 465, secure: true, name: 'SSL/TLS direct' },
  { port: 25, secure: false, name: 'SMTP standard (souvent bloqué)' },
];

console.log('\n TEST DE CONNEXION SMTP INFOMANIAK\n');
console.log('═'.repeat(60));
console.log(`Host: ${process.env.EMAIL_HOST || 'mail.infomaniak.com'}`);
console.log(`User: ${process.env.EMAIL_USER}`);
console.log(`Password: ${'*'.repeat(process.env.EMAIL_PASS?.length || 0)}`);
console.log('═'.repeat(60));
console.log('');

// Fonction de test pour un port spécifique
async function testPort(config) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    console.log(`\n Test ${config.name} (Port ${config.port})...`);
    
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'mail.infomaniak.com',
      port: config.port,
      secure: config.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
        ciphers: 'SSLv3',
      },
      connectionTimeout: 15000, // 15 secondes pour le test
      greetingTimeout: 10000,
      socketTimeout: 15000,
      debug: false, // Mettre à true pour voir tous les détails
      logger: false,
    });

    // Test de vérification de la connexion
    transporter.verify((error, success) => {
      const duration = Date.now() - startTime;
      
      if (error) {
        log.error(`Port ${config.port} : ÉCHEC (${duration}ms)`);
        console.log(`   Code erreur: ${error.code || 'N/A'}`);
        console.log(`   Message: ${error.message}`);
        
        resolve({
          port: config.port,
          name: config.name,
          success: false,
          duration,
          error: error.code || error.message,
        });
      } else {
        log.success(`Port ${config.port} : CONNECTÉ ! (${duration}ms)`);
        console.log(`   Status: ${JSON.stringify(success)}`);
        
        resolve({
          port: config.port,
          name: config.name,
          success: true,
          duration,
        });
      }
    });
  });
}

// Fonction principale
async function runTests() {
  const results = [];
  
  // Vérifier les variables d'environnement
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    log.error('Variables d\'environnement manquantes !');
    console.log('Assurez-vous que EMAIL_USER et EMAIL_PASS sont configurés dans .env');
    process.exit(1);
  }
  
  // Tester tous les ports séquentiellement
  for (const config of PORTS_CONFIG) {
    const result = await testPort(config);
    results.push(result);
    
    // Pause de 2 secondes entre chaque test
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Résumé final
  console.log('\n');
  console.log('═'.repeat(60));
  console.log(' RÉSUMÉ DES TESTS');
  console.log('═'.repeat(60));
  
  const successfulPorts = results.filter(r => r.success);
  const failedPorts = results.filter(r => !r.success);
  
  if (successfulPorts.length > 0) {
    console.log('\n PORTS FONCTIONNELS :');
    successfulPorts.forEach(r => {
      console.log(`   • Port ${r.port} (${r.name}) - ${r.duration}ms`);
    });
  }
  
  if (failedPorts.length > 0) {
    console.log('\n PORTS BLOQUÉS :');
    failedPorts.forEach(r => {
      console.log(`   • Port ${r.port} (${r.name}) - Erreur: ${r.error}`);
    });
  }
  
  // Recommandations
  console.log('\n');
  console.log('═'.repeat(60));
  console.log(' RECOMMANDATIONS');
  console.log('═'.repeat(60));
  
  if (successfulPorts.length === 0) {
    log.error('Aucun port ne fonctionne !');
    console.log('\n Solutions possibles :');
    console.log('   1. Vérifier vos identifiants Infomaniak');
    console.log('   2. Vérifier que votre IP n\'est pas bloquée par Infomaniak');
    console.log('   3. Contacter le support Render pour débloquer les ports SMTP');
    console.log('   4. Upgrade vers Render Starter ($7/mois) pour débloquer tous les ports');
    console.log('   5. Migrer vers un VPS (DigitalOcean, Vultr) avec accès réseau complet');
  } else {
    const bestPort = successfulPorts.sort((a, b) => a.duration - b.duration)[0];
    log.success(`Utiliser le port ${bestPort.port} (plus rapide: ${bestPort.duration}ms)`);
    console.log('\n Configuration recommandée pour .env sur Render :');
    console.log('');
    console.log(`EMAIL_HOST=mail.infomaniak.com`);
    console.log(`EMAIL_PORT=${bestPort.port}`);
    console.log(`EMAIL_USER=${process.env.EMAIL_USER}`);
    console.log(`EMAIL_PASS=***********`);
    console.log(`EMAIL_FROM=TalentProof <${process.env.EMAIL_USER}>`);
    console.log('');
  }
  
  console.log('═'.repeat(60));
  console.log('');
}

// Lancer les tests
runTests().catch(error => {
  log.error('Erreur fatale lors des tests :');
  console.error(error);
  process.exit(1);
});
