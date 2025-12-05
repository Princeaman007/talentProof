const fs = require('fs');
const path = require('path');

/**
 * Script pour supprimer TOUS les console.log, console.warn, console.error, etc.
 * du projet TalentProof (frontend + backend)
 */

// Patterns à rechercher et supprimer
const consolePatterns = [
  // Console.log avec ou sans préfixe
  /console\.log\([^)]*\);?\s*$/gm,
  /console\.log\([^)]*\);\s*\/\/.*$/gm,
  
  // Console.warn
  /console\.warn\([^)]*\);?\s*$/gm,
  /console\.warn\([^)]*\);\s*\/\/.*$/gm,
  
  // Console.error  
  /console\.error\([^)]*\);?\s*$/gm,
  /console\.error\([^)]*\);\s*\/\/.*$/gm,
  
  // Console.info
  /console\.info\([^)]*\);?\s*$/gm,
  /console\.info\([^)]*\);\s*\/\/.*$/gm,
  
  // Console.debug
  /console\.debug\([^)]*\);?\s*$/gm,
  /console\.debug\([^)]*\);\s*\/\/.*$/gm,
];

// Fonction pour scanner récursivement un dossier
function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules, .git, dist, build
      if (!['node_modules', '.git', 'dist', 'build', 'uploads', 'logs'].includes(file)) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.match(/\.(js|jsx|ts|tsx|cjs|mjs)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fonction pour nettoyer un fichier
function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let modifications = 0;
  
  // Supprimer les lignes console.log/warn/error/info/debug
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    
    // Garder les lignes qui ne sont pas des console.xxx
    if (!trimmed.startsWith('console.')) {
      return true;
    }
    
    // Supprimer les lignes console.xxx
    if (trimmed.match(/^console\.(log|warn|error|info|debug)\(/)) {
      modifications++;
      return false;
    }
    
    return true;
  });
  
  content = cleanedLines.join('\n');
  
  // Nettoyer les lignes vides multiples
  content = content.replace(/\n{3,}/g, '\n\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return modifications;
  }
  
  return 0;
}

// Main
console.log('\n🧹 NETTOYAGE DES CONSOLE.LOG DU PROJET TALENTPROOF\n');
console.log('═'.repeat(60));

const rootDir = __dirname;
const clientDir = path.join(rootDir, 'client', 'src');
const backendDir = path.join(rootDir, 'backend');

console.log('\n📁 Scanning frontend (client/src)...');
const clientFiles = scanDirectory(clientDir);
console.log(`   Trouvé ${clientFiles.length} fichiers JS/JSX`);

console.log('\n📁 Scanning backend...');
const backendFiles = scanDirectory(backendDir);
console.log(`   Trouvé ${backendFiles.length} fichiers JS`);

const allFiles = [...clientFiles, ...backendFiles];
console.log(`\n📊 Total: ${allFiles.length} fichiers à traiter\n`);
console.log('═'.repeat(60));

let totalModifications = 0;
let filesModified = 0;

allFiles.forEach((file, index) => {
  const mods = cleanFile(file);
  if (mods > 0) {
    filesModified++;
    totalModifications += mods;
    const relativePath = file.replace(rootDir, '');
    console.log(`✅ [${index + 1}/${allFiles.length}] ${relativePath} (${mods} console.xxx supprimés)`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`\n✨ NETTOYAGE TERMINÉ !`);
console.log(`   Fichiers modifiés: ${filesModified}/${allFiles.length}`);
console.log(`   Console.xxx supprimés: ${totalModifications}`);
console.log(`\n🎉 Le code est maintenant propre et prêt pour la production !\n`);
