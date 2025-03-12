require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get PostgreSQL connection string from environment variables
const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  console.error('Error: PostgreSQL connection URL is missing in environment variables');
  process.exit(1);
}

console.log('PostgreSQL URL available:', !!postgresUrl);

// Create a new Pool instance
const pool = new Pool({
  connectionString: postgresUrl,
  ssl: { rejectUnauthorized: false }
});

async function createClientTables() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to PostgreSQL');
    
    // Read SQL schema file
    console.log('Reading SQL schema file...');
    const schemaFilePath = path.join(__dirname, 'client-schema.sql');
    const sqlSchema = fs.readFileSync(schemaFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlSchema.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          await client.query(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        } catch (err) {
          console.error(`Error executing statement ${i + 1}:`, err.message);
          // Continue with other statements
        }
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Client tables setup completed successfully!');
    
    // Create a test client
    console.log('Creating test client...');
    try {
      const bcrypt = require('bcryptjs');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await client.query(`
        INSERT INTO clients (name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email, phone, created_at
      `, ['Test Client', 'testclient@example.com', '1234567890', hashedPassword]);
      
      if (result.rows.length > 0) {
        console.log('Test client created successfully:');
        console.log('Email: testclient@example.com');
        console.log('Password: password123');
        console.log('Client data:', result.rows[0]);
      } else {
        console.log('Test client already exists or could not be created');
      }
    } catch (err) {
      console.error('Error creating test client:', err.message);
    }
    
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error creating client tables:', err.message);
  } finally {
    // Release client back to pool
    client.release();
    // Close pool
    await pool.end();
  }
}

createClientTables().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 