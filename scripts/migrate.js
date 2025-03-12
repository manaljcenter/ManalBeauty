const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('POSTGRES_URL is not defined in .env.local');
    process.exit(1);
  }

  // Log a masked version of the connection string for security
  const maskedConnectionString = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log('Using connection string:', maskedConnectionString);
  
  try {
    // Use SSL for Supabase connection
    const sql = postgres(connectionString, { 
      ssl: { rejectUnauthorized: false },
      max: 1
    });
    
    const db = drizzle(sql);

    console.log('Running migrations...');
    
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Migrations completed successfully');
    
    // Close the connection
    await sql.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main(); 