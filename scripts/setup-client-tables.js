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

// Function to execute a SQL query directly
async function executeSql(query) {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return { error };
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: query
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { error: { message: errorText, status: response.status } };
    }
    
    const result = await response.json();
    return { data: result };
  } catch (error) {
    return { error };
  }
}

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
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        // Try using the Supabase client directly
        try {
          const { data, error } = await supabase.from('clients').select('count').limit(1);
          if (error) {
            console.log('Table does not exist yet, creating...');
          } else {
            console.log('Table already exists, count:', data);
          }
        } catch (err) {
          console.log('Error checking table:', err.message);
        }
        
        // Create tables directly
        if (statement.toLowerCase().includes('create table')) {
          const tableName = statement.match(/create\s+table\s+if\s+not\s+exists\s+(\w+)/i)?.[1];
          if (tableName) {
            console.log(`Creating table: ${tableName}`);
            
            // Use direct SQL execution
            const { error } = await executeSql(statement);
            
            if (error) {
              console.error(`Error creating table ${tableName}:`, error);
            } else {
              console.log(`Table ${tableName} created or already exists`);
            }
          }
        }
      }
    }

    console.log('Client schema setup completed successfully!');
    
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