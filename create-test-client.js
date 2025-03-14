// This script creates a test client account for testing purposes
const fetch = require('node-fetch');

async function createTestClient() {
  try {
    // Test client data
    const testClient = {
      name: 'Test Client',
      email: 'testclient@example.com',
      phone: '1234567890',
      password: 'password123'
    };

    console.log('Creating test client with data:', {
      ...testClient,
      password: '********' // Don't log the actual password
    });

    // Register the client
    const response = await fetch('http://localhost:3000/api/client/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testClient)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Test client created successfully:', data);
      console.log('\nYou can now log in with:');
      console.log(`Email: ${testClient.email}`);
      console.log(`Password: ${testClient.password}`);
    } else {
      console.error('Failed to create test client:', data);
    }
  } catch (error) {
    console.error('Error creating test client:', error);
  }
}

createTestClient();
