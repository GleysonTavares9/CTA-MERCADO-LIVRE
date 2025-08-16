#!/usr/bin/env node

/**
 * Build Script for MercadoLivre Poster Generator
 * Handles production build with optimizations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting production build...');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.warn('⚠️  .env file not found. Make sure to set VITE_GEMINI_API_KEY');
}

try {
  // Clean dist folder
  console.log('🧹 Cleaning dist folder...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Run build
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check build size
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    const stats = fs.statSync(distPath);
    console.log('✅ Build completed successfully!');
    console.log(`📊 Build size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log('🎉 Production build ready for deployment!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}