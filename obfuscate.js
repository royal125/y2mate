// obfuscate.js
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('🚀 Starting obfuscation process...');

// Configuration for obfuscation
// In obfuscate.js, change to:
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1, // Maximum
  deadCodeInjection: true,           // Adds fake code
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 4000,     // Crashes debugger
  disableConsoleOutput: true,        // Removes all console.log
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: true,               // Renames global variables
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4', 'base64'],
  stringArrayThreshold: 1,
  transformObjectKeys: true,         // Obfuscates object keys
  unicodeEscapeSequence: true        // Encodes strings to unicode
};

// Function to obfuscate a file
function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is too small or contains source map
    if (code.includes('sourceMappingURL') || code.length < 100) {
      return false;
    }
    
    const result = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    fs.writeFileSync(filePath, result.getObfuscatedCode());
    return true;
  } catch (error) {
    console.error(`Error obfuscating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function obfuscateBuildFolder() {
  const buildPath = path.join(__dirname, 'build');
  
  if (!fs.existsSync(buildPath)) {
    console.error('❌ Build folder not found! Run "npm run build" first.');
    process.exit(1);
  }

  let obfuscatedCount = 0;
  
  // Find all JS files in build folder
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (file.endsWith('.js') && !file.endsWith('.map')) {
        if (obfuscateFile(fullPath)) {
          obfuscatedCount++;
          console.log(`✅ Obfuscated: ${path.relative(buildPath, fullPath)}`);
        }
      }
    });
  }
  
  processDirectory(buildPath);
  console.log(`\n🎉 Obfuscation complete! ${obfuscatedCount} files obfuscated.`);
}

obfuscateBuildFolder();