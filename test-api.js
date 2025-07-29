// Simple API test script
const testApi = async () => {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('Testing API endpoints...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check result:', healthData);
    
    // Test cards endpoint
    console.log('\n2. Testing cards endpoint...');
    const cardsResponse = await fetch(`${baseUrl}/cards`);
    const cardsData = await cardsResponse.json();
    console.log('Cards endpoint result:', cardsData);
    
    console.log('\n✅ API is working correctly!');
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
};

// Run the test
testApi(); 