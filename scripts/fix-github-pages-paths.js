#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

console.log('Fixing GitHub Pages paths...');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in dist directory');
  process.exit(1);
}

// Read the HTML content
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths for GitHub Pages
htmlContent = htmlContent.replace(/src="\/(_expo\/)/g, 'src="./$1');
htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="./$1"');

// Write the fixed content back
fs.writeFileSync(indexPath, htmlContent);

console.log('✅ Fixed paths for GitHub Pages deployment');
console.log('- Converted absolute paths to relative paths');