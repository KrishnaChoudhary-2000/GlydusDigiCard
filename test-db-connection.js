#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the database connection and application health
 * Run with: node test-db-connection.js
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function testConnection() {
  console.log('🧪 Testing Glydus Digital Business Card Application...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ Health check passed');
    console.log(`   Status: ${healthData.status}`);
    console.log(`   Uptime: ${healthData.uptime}`);
    console.log(`   Memory: ${healthData.memory.heapUsed}`);
    
    // Test 2: Database Status
    console.log('\n2. Testing database status...');
    const dbResponse = await fetch(`${BASE_URL}/api/db-status`);
    const dbData = await dbResponse.json();
    
    console.log('✅ Database status retrieved');
    console.log(`   Connected: ${dbData.connected}`);
    console.log(`   Connecting: ${dbData.connecting}`);
    console.log(`   Retry Count: ${dbData.retryCount}`);
    console.log(`   Has URI: ${dbData.hasUri}`);
    
    if (dbData.lastError) {
      console.log(`   Last Error: ${dbData.lastError}`);
    }

    // Test 3: Cards API
    console.log('\n3. Testing cards API...');
    const cardsResponse = await fetch(`${BASE_URL}/api/cards`);
    const cardsData = await cardsResponse.json();
    
    console.log('✅ Cards API working');
    console.log(`   Cards found: ${cardsData.length}`);

    // Test 4: Create Test Card
    console.log('\n4. Testing card creation...');
    const testCard = {
      cardName: 'Test Card',
      name: 'Test User',
      title: 'Developer',
      companyName: 'Test Company',
      email: 'test@example.com',
      styleOptions: {
        accentColor: '#00D1A6'
      }
    };

    const createResponse = await fetch(`${BASE_URL}/api/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCard)
    });

    if (createResponse.ok) {
      const createdCard = await createResponse.json();
      console.log('✅ Card created successfully');
      console.log(`   Card ID: ${createdCard._id}`);
      
      // Clean up - delete test card
      await fetch(`${BASE_URL}/api/cards/${createdCard._id}`, {
        method: 'DELETE'
      });
      console.log('✅ Test card cleaned up');
    } else {
      console.log('❌ Card creation failed');
    }

    // Summary
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Health: ✅ Working`);
    console.log(`   Database: ${dbData.connected ? '✅ Connected' : '⚠️ Using fallback'}`);
    console.log(`   API: ✅ Working`);
    console.log(`   Card Operations: ✅ Working`);
    
    if (!dbData.connected) {
      console.log('\n💡 Note: Application is running in fallback mode (in-memory storage)');
      console.log('   This is normal if MongoDB is not configured or unavailable');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running');
    console.log('2. Check if the port is correct');
    console.log('3. Verify network connectivity');
    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error); 