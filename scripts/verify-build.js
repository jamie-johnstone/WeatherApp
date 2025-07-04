#!/usr/bin/env node

/**
 * Build Verification Script
 * Checks that the build output is correct and ready for deployment
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'dist';
const REQUIRED_FILES = [
  'index.html',
  '_expo/static/js',
  'favicon.ico',
  'metadata.json'
];

function checkFileExists(filePath) {
  const fullPath = path.join(BUILD_DIR, filePath);
  return fs.existsSync(fullPath);
}

function checkDirectory(dirPath) {
  const fullPath = path.join(BUILD_DIR, dirPath);
  try {
    const stats = fs.statSync(fullPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function checkBuildSize() {
  const buildPath = path.join(BUILD_DIR, '_expo/static');
  if (!fs.existsSync(buildPath)) {
    return { valid: false, message: 'Build directory not found' };
  }

  // Get total build size
  let totalSize = 0;
  const calculateSize = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  };

  calculateSize(buildPath);
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  return { 
    valid: totalSize > 0, 
    size: sizeMB,
    message: `Build size: ${sizeMB} MB`
  };
}

function main() {
  console.log('🔍 Verifying build output...');
  console.log('============================');

  // Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build directory not found. Run `npm run build:web` first.');
    process.exit(1);
  }

  let allPassed = true;

  // Check required files
  console.log('\n📁 Checking required files:');
  for (const file of REQUIRED_FILES) {
    const exists = file.includes('/') 
      ? checkDirectory(file) 
      : checkFileExists(file);
    
    if (exists) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing`);
      allPassed = false;
    }
  }

  // Check build size
  console.log('\n📊 Checking build size:');
  const sizeCheck = checkBuildSize();
  if (sizeCheck.valid) {
    console.log(`✅ ${sizeCheck.message}`);
    
    // Warn if build is too large
    if (parseFloat(sizeCheck.size) > 10) {
      console.log('⚠️  Warning: Build size is quite large (>10MB)');
    }
  } else {
    console.log(`❌ ${sizeCheck.message}`);
    allPassed = false;
  }

  // Check index.html content
  console.log('\n📄 Checking index.html:');
  const indexPath = path.join(BUILD_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    if (content.includes('<title>Weather App') && content.includes('</title>')) {
      console.log('✅ Title tag found');
    } else {
      console.log('❌ Title tag missing or incorrect');
      allPassed = false;
    }

    if (content.includes('viewport')) {
      console.log('✅ Viewport meta tag found');
    } else {
      console.log('❌ Viewport meta tag missing');
      allPassed = false;
    }
  }

  // Final result
  console.log('\n' + '='.repeat(30));
  if (allPassed) {
    console.log('✅ Build verification passed!');
    console.log('🚀 Ready for deployment');
    process.exit(0);
  } else {
    console.log('❌ Build verification failed!');
    console.log('🔧 Please fix the issues above');
    process.exit(1);
  }
}

main();