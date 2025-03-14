// This script creates multiple example clients for testing purposes
const fetch = require('node-fetch');

// Array of example clients
const exampleClients = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '0501234567',
    password: 'Password123'
  },
  {
    name: 'Mohammed Ali',
    email: 'mohammed.ali@example.com',
    phone: '0509876543',
    password: 'Password123'
  },
  {
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@example.com',
    phone: '0507654321',
    password: 'Password123'
  },
  {
    name: 'Omar Hassan',
    email: 'omar.hassan@example.com',
    phone: '0503456789',
    password: 'Password123'
  },
  {
    name: 'Layla Ibrahim',
    email: 'layla.ibrahim@example.com',
    phone: '0508765432',
    password: 'Password123'
  }
];

async function createClient(clientData) {
  try {
    console.log(`Creating client: ${clientData.name} (${clientData.email})`);
    
    const response = await fetch('http://localhost:3000/api/client/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Successfully created client: ${clientData.name}`);
      return { success: true, data };
    } else {
      console.error(`❌ Failed to create client: ${clientData.name}`, data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error(`❌ Error creating client: ${clientData.name}`, error);
    return { success: false, error };
  }
}

async function createAllClients() {
  console.log('Starting to create example clients...');
  console.log('-----------------------------------');
  
  const results = [];
  
  for (const client of exampleClients) {
    const result = await createClient(client);
    results.push({ client, result });
  }
  
  console.log('\n-----------------------------------');
  console.log('Summary of client creation:');
  
  const successful = results.filter(r => r.result.success);
  const failed = results.filter(r => !r.result.success);
  
  console.log(`Total clients: ${results.length}`);
  console.log(`Successfully created: ${successful.length}`);
  console.log(`Failed to create: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\nYou can log in with any of these credentials:');
    successful.forEach(({ client }) => {
      console.log(`\nName: ${client.name}`);
      console.log(`Email: ${client.email}`);
      console.log(`Password: ${client.password}`);
    });
  }
}

createAllClients(); 