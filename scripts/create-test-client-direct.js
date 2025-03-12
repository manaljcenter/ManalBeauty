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

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestClient() {
  try {
    console.log('Checking if clients table exists...');
    
    // Check if clients table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking clients table:', tableError);
      console.log('Please run the SQL script in the Supabase SQL editor first to create the tables.');
      return;
    }
    
    console.log('Clients table exists, proceeding with client creation...');
    
    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating test client...');
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
      
      // Check if client already exists
      const { data: existingClient, error: existingError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', 'testclient@example.com')
        .single();
      
      if (existingError) {
        console.error('Error checking for existing client:', existingError);
      } else if (existingClient) {
        console.log('Test client already exists:');
        console.log('Email: testclient@example.com');
        console.log('Password: password123');
        console.log('Client data:', existingClient);
      }
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

createTestClient(); 