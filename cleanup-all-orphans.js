const fs = require('fs');
const path = require('path');

// Scanner récursivement tous les fichiers JS/JSX dans client/src
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!item.includes('node_modules') && !item.includes('.git') && !item.includes('dist') && !item.includes('build')) {
        getAllFiles(fullPath, files);
      }
    } else if (/\.(jsx?|tsx?)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Nettoyer un fichier des blocs orphelins
function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fixedLines = [];
  let skip = false;
  let changes = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Détecter bloc orphelin: ligne avec propriété suivie de : et valeur
    // Pattern: espace + mot + : + valeur + virgule
    if (/^\s+\w+:\s+.*,\s*$/.test(line) && i > 0) {
      const prevLine = lines[i - 1].trim();
      // Si ligne précédente est vide ou un commentaire, c'est probablement orphelin
      if (prevLine === '' || prevLine.startsWith('//')) {
        // Chercher fermeture });
        let foundEnd = false;
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          if (lines[j].trim() === '});') {
            foundEnd = true;
            break;
          }
        }
        
        if (foundEnd) {
          skip = true;
          changes++;
          continue;
        }
      }
    }
    
    // Fin du bloc orphelin
    if (skip && trimmed === '});') {
      skip = false;
      continue;
    }
    
    // Skip les lignes du bloc
    if (skip) {
      continue;
    }
    
    fixedLines.push(line);
  }
  
  if (changes > 0) {
    // Nettoyer lignes vides multiples
    const finalLines = [];
    let previousEmpty = false;
    
    for (const line of fixedLines) {
      const isEmpty = line.trim() === '';
      if (isEmpty && previousEmpty) continue;
      finalLines.push(line);
      previousEmpty = isEmpty;
    }
    
    fs.writeFileSync(filePath, finalLines.join('\n'), 'utf8');
    return changes;
  }
  
  return 0;
}

// Main
const clientSrc = path.join(__dirname, 'client', 'src');
const allFiles = getAllFiles(clientSrc);

let totalChanges = 0;
let filesModified = 0;

console.log(`🔍 Scanning ${allFiles.length} files...\n`);

for (const file of allFiles) {
  const changes = cleanFile(file);
  if (changes > 0) {
    filesModified++;
    totalChanges += changes;
    console.log(`✅ ${path.relative(__dirname, file)}: ${changes} blocs orphelins supprimés`);
  }
}

console.log(`\n🎉 TERMINÉ!`);
console.log(`   Fichiers modifiés: ${filesModified}/${allFiles.length}`);
console.log(`   Total blocs supprimés: ${totalChanges}`);
