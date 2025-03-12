require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key is missing in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createClientTables() {
  try {
    console.log('Creating client tables...');

    // Create clients table
    console.log('Creating clients table...');
    const { error: clientsError } = await supabase.rpc('create_clients_table', {});
    
    if (clientsError) {
      console.log('Error creating clients table, trying direct method...');
      
      // Try direct method using the REST API
      const { error } = await supabase
        .from('clients')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log('Clients table does not exist, creating...');
        
        // Create the table using the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/clients`, {
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
        
        if (!response.ok) {
          console.error('Error creating clients table:', await response.text());
        } else {
          console.log('Clients table created successfully');
        }
      } else {
        console.log('Clients table already exists');
      }
    } else {
      console.log('Clients table created successfully');
    }

    // Create a test client
    console.log('Creating test client...');
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: 'Test Client',
        email: 'testclient@example.com',
        phone: '1234567890',
        password: '$2a$10$XQiGKc3uxaJ0KgEMaUu.9.xyJX1JB0gk7qlBEtQXXQxU5KxZ8tdHC' // password: password123
      })
      .select();

    if (clientError) {
      console.error('Error creating test client:', clientError);
    } else {
      console.log('Test client created successfully:', client);
    }

    console.log('Client tables setup completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

createClientTables(); 