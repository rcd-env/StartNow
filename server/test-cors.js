// Simple CORS test script
import fetch from 'node-fetch';

const testCORS = async () => {
  try {
    console.log('🧪 Testing CORS configuration...\n');
    
    const origins = [
      'https://start-now-xi.vercel.app',
      'https://start-now-xi.vercel.app/',
      'http://localhost:5173'
    ];
    
    for (const origin of origins) {
      console.log(`Testing origin: ${origin}`);
      
      const response = await fetch('https://startnow-9c9x.onrender.com/api/startups', {
        method: 'GET',
        headers: {
          'Origin': origin,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`CORS Header: ${response.headers.get('access-control-allow-origin')}`);
      
      if (response.ok) {
        console.log('✅ Success\n');
      } else {
        console.log('❌ Failed\n');
      }
    }
    
  } catch (error) {
    console.error('Error testing CORS:', error.message);
  }
};

testCORS();
