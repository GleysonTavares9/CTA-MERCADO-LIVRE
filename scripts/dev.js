#!/usr/bin/env node

/**
 * Development Script for MercadoLivre Poster Generator
 * Starts development server with environment checks
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Starting development server...');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.warn('⚠️  .env file not found. Creating from example...');
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created from .env.example');
    console.log('🔑 Please add your VITE_GEMINI_API_KEY to .env file');
  }
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
  process.exit(1);
}

try {
  console.log('🚀 Starting Vite development server...');
  execSync('npm run dev:vite', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
}