require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key is missing in environment variables');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key available:', !!supabaseKey);

async function createTable(tableName, definition) {
  try {
    console.log(`Creating table: ${tableName}`);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        table_name: tableName,
        definition: definition
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error creating table ${tableName}:`, errorText);
      return false;
    }
    
    console.log(`Table ${tableName} created successfully`);
    return true;
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error.message);
    return false;
  }
}

async function createTestClient() {
  try {
    console.log('Creating test client...');
    
    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: 'Test Client',
        email: 'testclient@example.com',
        phone: '1234567890',
        password: hashedPassword
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating test client:', errorText);
      return;
    }
    
    const client = await response.json();
    console.log('Test client created successfully:');
    console.log('Email: testclient@example.com');
    console.log('Password: password123');
    console.log('Client data:', client);
  } catch (error) {
    console.error('Error creating test client:', error.message);
  }
}

async function createClientTables() {
  try {
    console.log('Creating client tables...');
    
    // First, let's check if we can access the Supabase API
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=*&limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });
    
    if (!testResponse.ok) {
      console.error('Error accessing Supabase API:', await testResponse.text());
      return;
    }
    
    const users = await testResponse.json();
    console.log('Successfully accessed Supabase API, found users:', users.length);
    
    // Now let's try to create the clients table directly
    const createClientsResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: 'schema',
        name: 'string',
        email: 'string',
        phone: 'string',
        password: 'string',
        created_at: 'timestamp with time zone',
        updated_at: 'timestamp with time zone'
      })
    });
    
    if (!createClientsResponse.ok) {
      console.error('Error creating clients table:', await createClientsResponse.text());
    } else {
      console.log('Clients table created successfully');
      
      // Now let's create a test client
      await createTestClient();
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

createClientTables(); 