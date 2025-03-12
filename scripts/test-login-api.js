// Test script for login API
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testLoginApi() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@manalbeauty.com',
        password: 'admin123',
      }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Login successful!');
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error testing login API:', error);
  }
}

testLoginApi(); 