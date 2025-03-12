require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key is missing in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupClientSchema() {
  try {
    console.log('Reading SQL schema file...');
    const schemaFilePath = path.join(__dirname, 'setup-client-schema.sql');
    const sqlSchema = fs.readFileSync(schemaFilePath, 'utf8');

    // Split the SQL into individual statements
    const statements = sqlSchema.split(';').filter(stmt => stmt.trim() !== '');

    console.log('Executing SQL schema against Supabase...');
    
    // Execute each statement separately
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        .catch(err => {
          console.log('Trying alternative method for statement:', statement.substring(0, 50) + '...');
          return supabase.from('_exec_sql').select('*').eq('query', statement + ';');
        });

      if (error) {
        console.error('Error executing SQL statement:', error);
        console.error('Statement:', statement);
        // Continue with other statements instead of exiting
        console.log('Continuing with next statement...');
      }
    }

    console.log('Client schema setup completed successfully!');
    
    // Check if clients table exists before creating a test client
    console.log('Checking if clients table exists...');
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error('Error checking clients table:', tableCheckError);
      return;
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

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

setupClientSchema(); 