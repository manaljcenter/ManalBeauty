// Test script for middleware
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testMiddleware() {
  try {
    console.log('Testing middleware...');
    
    // First, login to get the cookies
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@manalbeauty.com',
        password: 'admin123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      console.log('Login failed:', loginData.message);
      return;
    }
    
    console.log('Login successful!');
    
    // Get the cookies from the response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', cookies);
    
    if (!cookies) {
      console.log('No cookies received from login');
      return;
    }
    
    // Now try to access the admin page with the cookies
    const adminResponse = await fetch('http://localhost:3000/admin', {
      headers: {
        Cookie: cookies,
      },
    });
    
    console.log('Admin page response status:', adminResponse.status);
    console.log('Admin page response URL:', adminResponse.url);
    
    if (adminResponse.status === 200) {
      console.log('Successfully accessed admin page!');
    } else if (adminResponse.url.includes('/login')) {
      console.log('Redirected to login page - middleware is working but session not recognized');
    } else {
      console.log('Failed to access admin page');
    }
  } catch (error) {
    console.error('Error testing middleware:', error);
  }
}

testMiddleware(); 