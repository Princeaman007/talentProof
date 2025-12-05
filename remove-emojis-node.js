// Script Node.js pour supprimer tous les emojis des fichiers JS/JSX
const fs = require('fs');
const path = require('path');

// Pattern regex pour tous les emojis Unicode
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F1E0}-\u{1F1FF}]/gu;

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    // Ignorer certains répertoires
    if (fs.statSync(filePath).isDirectory()) {
      if (file === 'node_modules' || file === 'build' || file === 'dist' || file === 'uploads' || file === 'logs') {
        return;
      }
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      // Accepter seulement .js, .jsx, .cjs
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.cjs')) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

function removeEmojisFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(emojiRegex, '');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Erreur pour ${filePath}:`, error.message);
    return false;
  }
}

console.log('\n=== SUPPRESSION DES EMOJIS ===\n');

// Traiter frontend
const frontendFiles = getAllFiles('client/src');
const backendFiles = getAllFiles('backend');

const allFiles = [...frontendFiles, ...backendFiles];
let modifiedFiles = 0;

console.log(`Traitement de ${allFiles.length} fichiers...\n`);

allFiles.forEach((file, index) => {
  const relativePath = file.replace(process.cwd() + path.sep, '');
  
  if (removeEmojisFromFile(file)) {
    modifiedFiles++;
    console.log(`[OK] ${relativePath}`);
  }
  
  // Progress indicator
  if ((index + 1) % 20 === 0) {
    console.log(`Progress: ${index + 1}/${allFiles.length}`);
  }
});

console.log(`\n=== RÉSUMÉ ===`);
console.log(`Fichiers traités: ${allFiles.length}`);
console.log(`Fichiers modifiés: ${modifiedFiles}`);
console.log('\nTerminé!\n');
