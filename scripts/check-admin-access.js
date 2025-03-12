// Script to check if the admin page is accessible
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function checkAdminAccess() {
  try {
    console.log('Checking admin page access...');
    
    // Try to access the admin page without login
    const response = await fetch('http://localhost:3000/admin');
    
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    
    if (response.url.includes('/login')) {
      console.log('Redirected to login page - middleware is working correctly');
    } else if (response.status === 200) {
      console.log('WARNING: Admin page is accessible without login!');
    } else {
      console.log('Failed to access admin page with status:', response.status);
    }
  } catch (error) {
    console.error('Error checking admin access:', error);
  }
}

checkAdminAccess(); 