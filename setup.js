#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Setting up Glydus Digital Business Card Creator...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd server && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Check if MongoDB is running
console.log('\n🔍 Checking MongoDB connection...');
try {
  execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { stdio: 'pipe' });
  console.log('✅ MongoDB is running locally');
} catch (error) {
  console.log('⚠️  MongoDB is not running locally');
  console.log('   You can either:');
  console.log('   1. Start MongoDB locally: mongod');
  console.log('   2. Use MongoDB Atlas (cloud) - see README.md for instructions');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Start the backend: cd server && npm run dev');
console.log('   2. Start the frontend: npm run dev');
console.log('   3. Open http://localhost:5173 in your browser');
console.log('\n📖 For detailed instructions, see README.md'); 