// This script creates a test client in the database
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
    // Check if clients table exists
    console.log('Checking if clients table exists...');
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Error checking clients table:', error);
        return;
      }
      
      console.log('Clients table exists, count:', data);
    } catch (err) {
      console.error('Error checking clients table:', err);
      return;
    }
    
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