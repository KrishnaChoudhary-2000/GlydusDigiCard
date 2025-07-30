const fetch = require('node-fetch');

async function testLocalSetup() {
  console.log('🧪 Testing Local Setup...\n');

  // Test 1: Backend Health Check
  try {
    console.log('1. Testing backend health check...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend is running:', healthData.message);
  } catch (error) {
    console.log('❌ Backend not running. Please start the server:');
    console.log('   cd server && npm start');
    return;
  }

  // Test 2: Get Cards
  try {
    console.log('\n2. Testing card retrieval...');
    const cardsResponse = await fetch('http://localhost:5000/api/cards');
    const cardsData = await cardsResponse.json();
    console.log('✅ Cards endpoint working. Found', cardsData.length, 'cards');
  } catch (error) {
    console.log('❌ Cards endpoint failed:', error.message);
  }

  // Test 3: Create Test Card
  try {
    console.log('\n3. Testing card creation...');
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

    const createResponse = await fetch('http://localhost:5000/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCard)
    });

    if (createResponse.ok) {
      const createdCard = await createResponse.json();
      console.log('✅ Card created successfully with ID:', createdCard._id);
      
      // Clean up - delete test card
      await fetch(`http://localhost:5000/api/cards/${createdCard._id}`, {
        method: 'DELETE'
      });
      console.log('✅ Test card cleaned up');
    } else {
      console.log('❌ Card creation failed');
    }
  } catch (error) {
    console.log('❌ Card creation test failed:', error.message);
  }

  console.log('\n🎉 Local setup test completed!');
  console.log('\nNext steps:');
  console.log('1. Start the frontend: npm run dev');
  console.log('2. Open http://localhost:5173 in your browser');
  console.log('3. Create and share your digital business card!');
}

testLocalSetup().catch(console.error); 