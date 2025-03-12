require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function createClientsTable() {
  try {
    console.log('Creating clients table...');
    
    // Try to create the clients table using the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS public.clients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
    });
    
    if (!response.ok) {
      console.error('Error creating clients table:', await response.text());
      console.log('You may need to run the SQL script in the Supabase SQL editor directly.');
      
      // Try to check if the table exists anyway
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('count')
        .limit(1);
      
      if (clientsError) {
        console.error('Error accessing clients table:', clientsError);
        console.log('The clients table does not exist or you do not have access to it.');
        return;
      } else {
        console.log('Successfully accessed clients table!');
      }
    } else {
      console.log('Clients table created successfully!');
    }
    
    // Create a test client
    console.log('Creating test client...');
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: 'Test Client',
        email: 'testclient@example.com',
        phone: '1234567890',
        password: hashedPassword
      })
      .select();
    
    if (clientError) {
      console.error('Error creating test client:', clientError);
    } else {
      console.log('Test client created successfully:');
      console.log('Email: testclient@example.com');
      console.log('Password: password123');
      console.log('Client data:', client);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createClientsTable(); 