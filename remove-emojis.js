const fs = require('fs');
const path = require('path');

// Regex pour détecter les emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2B50}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{23E9}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}-\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}-\u{2623}\u{2626}\u{262A}\u{262E}-\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}-\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}-\u{269C}\u{26A0}-\u{26A1}\u{26AA}-\u{26AB}\u{26B0}-\u{26B1}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26C8}\u{26CE}-\u{26CF}\u{26D1}\u{26D3}-\u{26D4}\u{26E9}-\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasEmoji = emojiRegex.test(content);
    
    if (hasEmoji) {
      const cleaned = content.replace(emojiRegex, '');
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log('Cleaned:', path.relative(process.cwd(), filePath));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error processing', filePath, ':', error.message);
    return false;
  }
}

function walkDirectory(dir, extensions) {
  let processed = 0;
  let cleaned = 0;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist' && file.name !== 'build') {
        const [p, c] = walkDirectory(fullPath, extensions);
        processed += p;
        cleaned += c;
      }
    } else if (file.isFile()) {
      const ext = path.extname(file.name);
      if (extensions.includes(ext)) {
        processed++;
        if (processFile(fullPath)) {
          cleaned++;
        }
      }
    }
  }
  
  return [processed, cleaned];
}

console.log('Starting emoji removal...\n');

const backendPath = path.join(__dirname, 'backend');
const clientPath = path.join(__dirname, 'client', 'src');
const extensions = ['.js', '.jsx', '.mjs', '.cjs'];

let totalProcessed = 0;
let totalCleaned = 0;

if (fs.existsSync(backendPath)) {
  console.log('Processing backend...');
  const [p, c] = walkDirectory(backendPath, extensions);
  totalProcessed += p;
  totalCleaned += c;
  console.log(`Backend: ${c}/${p} files cleaned\n`);
}

if (fs.existsSync(clientPath)) {
  console.log('Processing client/src...');
  const [p, c] = walkDirectory(clientPath, extensions);
  totalProcessed += p;
  totalCleaned += c;
  console.log(`Client: ${c}/${p} files cleaned\n`);
}

console.log(`\nTotal: ${totalCleaned}/${totalProcessed} files cleaned`);
console.log('Done!');
