const fs = require('fs');

const filePath = 'c:\\Users\\princ\\talentproof\\client\\src\\pages\\DashboardEntreprise.jsx';

// Lire le fichier
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Pattern: commentaire LOG suivi d'un bloc d'objet orphelin
// Exemple:
//   // LOG DÉTAILLÉ
//     propriété: valeur,
//     ...
//   });

const fixedLines = [];
let skip = false;
let skippedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Détecter début de bloc orphelin: commentaire LOG OU ligne avec propriété orpheline
  if (trimmed.startsWith('// LOG')) {
    // Vérifier si la ligne suivante commence par des propriétés d'objet (espace + mot: )
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (/^\s+\w+:/.test(nextLine)) {
        skip = true;
        skippedCount++;
        console.log(`❌ Bloc orphelin trouvé ligne ${i + 1}: ${trimmed}`);
        continue;
      }
    }
  }
  
  // Détecter aussi les propriétés orphelines sans commentaire (après const html = ...)
  if (i > 0 && /^\s+\w+:/.test(line)) {
    const prevLine = lines[i - 1].trim();
    // Si la ligne précédente est vide et qu'on n'est pas dans un objet/fonction
    if (prevLine === '') {
      // Vérifier si c'est un bloc orphelin (chercher });  quelques lignes plus loin)
      let foundEnd = false;
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        if (lines[j].trim() === '});') {
          foundEnd = true;
          break;
        }
        if (lines[j].trim() === 'return sendEmail({' || lines[j].trim().startsWith('const ')) {
          break; // Ce n'est pas un bloc orphelin
        }
      }
      if (foundEnd) {
        skip = true;
        skippedCount++;
        console.log(`❌ Bloc orphelin trouvé ligne ${i + 1}: ${trimmed.substring(0, 50)}...`);
        continue;
      }
    }
  }
  
  // Si on skip, chercher la fin du bloc: });
  if (skip) {
    if (trimmed === '});') {
      skip = false;
      console.log(`   └─ Supprimé jusqu'à ligne ${i + 1}`);
      continue;
    }
    // Continuer à skip
    continue;
  }
  
  // Ligne normale: conserver
  fixedLines.push(line);
}

// Nettoyer les lignes vides multiples
let finalLines = [];
let previousEmpty = false;

for (const line of fixedLines) {
  const isEmpty = line.trim() === '';
  
  // Ne pas avoir plus de 2 lignes vides consécutives
  if (isEmpty && previousEmpty) {
    continue;
  }
  
  finalLines.push(line);
  previousEmpty = isEmpty;
}

// Écrire le fichier corrigé
fs.writeFileSync(filePath, finalLines.join('\n'), 'utf8');

console.log('');
console.log('✅ CORRECTION TERMINÉE!');
console.log(`📊 ${skippedCount} blocs orphelins supprimés`);
console.log(`📝 Fichier: ${filePath}`);
