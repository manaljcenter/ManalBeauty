// This script tests the admin login functionality
const fetch = require('node-fetch');

async function testAdminLogin() {
  try {
    // Admin credentials
    const credentials = {
      email: 'manaljcenter@gmail.com',
      password: 'Manal@2019' // Replace with the actual admin password
    };

    console.log('Testing admin login with email:', credentials.email);

    // Attempt to login
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Admin login successful:', data);
      console.log('\nCookies should be set in the response.');
      console.log('\nYou should be redirected to the admin dashboard at /admin');
    } else {
      console.error('Admin login failed:', data);
    }
  } catch (error) {
    console.error('Error during admin login test:', error);
  }
}

testAdminLogin(); 