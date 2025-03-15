const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'undefined');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Testing Supabase connection...');
    
    // Try to query the clients table
    const { data, error } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error querying clients table:', error.message);
      process.exit(1);
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Data:', data);
    
    // List all tables
    console.log('\nListing all tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError.message);
    } else {
      console.log('Tables:', tables.map(t => t.tablename));
    }
    
    // Check if clients table exists
    console.log('\nChecking clients table...');
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .limit(5);
    
    if (clientsError) {
      console.error('Error querying clients table:', clientsError.message);
    } else {
      console.log(`Found ${clientsData.length} clients:`);
      clientsData.forEach(client => {
        console.log(`- ${client.name} (${client.email})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 