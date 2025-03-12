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

async function checkClientsTable() {
  try {
    console.log('Checking if clients table exists...');
    
    // List all tables in the public schema
    const { data, error } = await supabase
      .from('_tables')
      .select('*')
      .eq('schema', 'public');
    
    if (error) {
      console.error('Error listing tables:', error);
      console.log('The _tables table may not exist or you may not have access to it.');
      
      // Try to directly access the clients table
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
      console.log('Tables in public schema:', data);
      
      // Check if clients table exists
      const clientsTable = data.find(table => table.name === 'clients');
      if (clientsTable) {
        console.log('Clients table exists!');
      } else {
        console.log('Clients table does not exist.');
        return;
      }
    }
    
    // Try to get all clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*');
    
    if (clientsError) {
      console.error('Error getting clients:', clientsError);
    } else {
      console.log('Clients:', clients);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkClientsTable(); 