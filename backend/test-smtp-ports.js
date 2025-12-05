//  SCRIPT DE TEST DES PORTS SMTP INFOMANIAK
// Utilisation : node test-smtp-ports.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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


// Fonction de test pour un port spécifique
async function testPort(config) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    
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
        
        resolve({
          port: config.port,
          name: config.name,
          success: false,
          duration,
          error: error.code || error.message,
        });
      } else {
        log.success(`Port ${config.port} : CONNECTÉ ! (${duration}ms)`);
        
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
  
  const successfulPorts = results.filter(r => r.success);
  const failedPorts = results.filter(r => !r.success);
  
  if (successfulPorts.length > 0) {
    successfulPorts.forEach(r => {
    });
  }
  
  if (failedPorts.length > 0) {
    failedPorts.forEach(r => {
    });
  }
  
  // Recommandations
  
  if (successfulPorts.length === 0) {
    log.error('Aucun port ne fonctionne !');
  } else {
    const bestPort = successfulPorts.sort((a, b) => a.duration - b.duration)[0];
    log.success(`Utiliser le port ${bestPort.port} (plus rapide: ${bestPort.duration}ms)`);
  }
  
}

// Lancer les tests
runTests().catch(error => {
  log.error('Erreur fatale lors des tests :');
  process.exit(1);
});
