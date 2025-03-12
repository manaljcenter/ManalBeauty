require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error authenticating with Supabase:', authError);
    } else {
      console.log('Authentication successful');
    }
    
    // Test database access
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (userError) {
      console.log('Could not access users table:', userError.message);
      console.log('This is expected if the table does not exist or you do not have access to it.');
    } else {
      console.log('Successfully accessed users table:', userData);
    }
    
    // List all tables in the public schema
    console.log('Attempting to list tables in the public schema...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
      console.log('The get_tables function may not exist. This is normal.');
    } else {
      console.log('Tables in public schema:', tables);
    }
    
    console.log('Connection test completed.');
  } catch (error) {
    console.error('Unexpected error during connection test:', error);
  }
}

testConnection(); 