// This script tests the client login functionality
const fetch = require('node-fetch');

async function testClientLogin() {
  try {
    // Test client credentials
    const credentials = {
      email: 'testclient@example.com',
      password: 'password123'
    };

    console.log('Testing login with email:', credentials.email);

    // Attempt to login
    const response = await fetch('http://localhost:3000/api/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful:', data);
      console.log('\nCookies should be set in the response.');
    } else {
      console.error('Login failed:', data);
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testClientLogin(); 