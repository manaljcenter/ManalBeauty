const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Initialize Supabase client with service role key for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Checking if clients table exists...');
    
    // Try to query the clients table
    const { data, error } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    // If there's an error, the table might not exist
    if (error && error.message.includes('does not exist')) {
      console.log('Clients table does not exist. Creating it...');
      
      // Create the clients table using SQL
      const { error: createError } = await supabase.rpc('create_clients_table');
      
      if (createError) {
        console.error('Error creating clients table using RPC:', createError.message);
        console.log('Trying to create table using raw SQL...');
        
        // Try to create the table using raw SQL
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.clients (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              phone TEXT,
              password TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
          `
        });
        
        if (sqlError) {
          console.error('Error creating clients table using SQL:', sqlError.message);
          
          // Last resort: try to create the table using the REST API
          console.log('Trying to create table using REST API...');
          
          // First, check if the table exists
          const { error: restError } = await supabase
            .from('clients')
            .select('count')
            .limit(1);
          
          if (restError && restError.message.includes('does not exist')) {
            console.log('Creating clients table using REST API...');
            
            // Create a test client to force table creation
            const { error: insertError } = await supabase
              .from('clients')
              .insert({
                name: 'Test Client',
                email: 'test@example.com',
                phone: '',
                password: 'password_hash_here',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            
            if (insertError) {
              console.error('Error creating clients table using REST API:', insertError.message);
              process.exit(1);
            } else {
              console.log('Successfully created clients table using REST API!');
            }
          } else {
            console.log('Clients table already exists!');
          }
        } else {
          console.log('Successfully created clients table using SQL!');
        }
      } else {
        console.log('Successfully created clients table using RPC!');
      }
    } else if (error) {
      console.error('Error checking clients table:', error.message);
      process.exit(1);
    } else {
      console.log('Clients table already exists!');
    }
    
    // Create a test client
    console.log('\nCreating test client...');
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '',
        password: '$2b$10$X7VYHy.uAIYjcVMz38B1.uaHhIJM0oAJmD5XbJUCGGGHzQGwbxHK6', // password123
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (clientError) {
      console.error('Error creating test client:', clientError.message);
    } else {
      console.log('Successfully created test client!');
      console.log('Client data:', client);
    }
    
    // Check if clients table exists and has data
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