const fs = require('fs');
const path = require('path');

// Copy _redirects file to build folder
const srcPath = path.join(__dirname, '_redirects');
const destPath = path.join(__dirname, 'build', '_redirects');

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log('_redirects file copied to build folder');
} else {
  console.log('_redirects file not found');
}