const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/dashboard/TalentsDashboard.jsx',
  'client/src/pages/dashboard/MesNotifications.jsx',
  'client/src/pages/dashboard/MesFavoris.jsx',
  'client/src/pages/dashboard/AdminTalents.jsx',
  'client/src/pages/dashboard/Adminstats.jsx',
  'client/src/pages/dashboard/AdminCompanies.jsx'
];

let totalRemoved = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  console.log(`\n📁 Processing: ${file}`);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Pattern pour détecter les blocs orphelins (console.log supprimé mais objet resté)
  // Cherche les patterns comme:
  //   status: response.status,
  //   data: response.data,
  //   dataKeys: ...
  // });
  
  const orphanPattern = /\n\s+(status|data|url|method|message|headers|statusText|error|dataKeys|favorisCount):\s+(response|error)\.[^\n]+\n(?:\s+(status|data|url|method|message|headers|statusText|error|dataKeys|favorisCount):\s+(response|error)\.[^\n]+\n)*(?:\s+(status|data|url|method|message|headers|statusText|error|dataKeys|favorisCount):\s+[^\n]+\n)*\s*\}\);/g;
  
  let removedCount = 0;
  content = content.replace(orphanPattern, () => {
    removedCount++;
    return '';
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✅ Removed ${removedCount} orphan block(s)`);
    totalRemoved += removedCount;
  } else {
    console.log(`  ℹ️  No orphans found`);
  }
});

console.log(`\n✨ Total orphan blocks removed: ${totalRemoved}`);
