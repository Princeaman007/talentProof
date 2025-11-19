const fs = require('fs');
const path = require('path');

// Regex pour les variation selectors
const variationSelector = /[\uFE0F\u200D]/gu;

function cleanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (variationSelector.test(content)) {
      const cleaned = content.replace(variationSelector, '');
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log('Cleaned:', path.relative(process.cwd(), filePath));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error:', filePath, error.message);
    return false;
  }
}

function walkDirectory(dir, extensions) {
  let cleaned = 0;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build'].includes(file.name)) {
        cleaned += walkDirectory(fullPath, extensions);
      }
    } else if (file.isFile()) {
      const ext = path.extname(file.name);
      if (extensions.includes(ext)) {
        if (cleanFile(fullPath)) {
          cleaned++;
        }
      }
    }
  }
  
  return cleaned;
}

console.log('Removing variation selectors...\n');

const extensions = ['.js', '.jsx', '.mjs', '.cjs'];
let total = 0;

if (fs.existsSync('backend')) {
  total += walkDirectory('backend', extensions);
}

if (fs.existsSync('client')) {
  total += walkDirectory('client', extensions);
}

console.log(`\nCleaned ${total} files`);
