const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('POSTGRES_URL is not defined in .env.local');
    process.exit(1);
  }

  const sql = postgres(connectionString, { ssl: 'require' });
  
  // Create migrations directory if it doesn't exist
  const migrationsDir = join(process.cwd(), 'drizzle', 'migrations');
  if (!existsSync(migrationsDir)) {
    mkdirSync(migrationsDir, { recursive: true });
  }
  
  // Generate a timestamp for the migration name
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').split('T')[0];
  const migrationName = `${timestamp}_initial_schema`;
  const migrationFilePath = join(migrationsDir, `${migrationName}.sql`);
  
  // SQL for creating enums
  const createEnums = `
    DO $$ BEGIN
      CREATE TYPE service_category AS ENUM ('facial', 'hair_removal', 'skin_treatment', 'massage', 'other');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;
  
  // SQL for creating tables
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      duration INTEGER,
      category service_category,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      service_id INTEGER REFERENCES services(id),
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT,
      date TIMESTAMP NOT NULL,
      time TEXT NOT NULL,
      status booking_status DEFAULT 'pending',
      notes TEXT,
      payment_status TEXT DEFAULT 'unpaid',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      birthdate TIMESTAMP,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  // Write the migration file
  const migrationContent = `${createEnums}\n${createTables}`;
  writeFileSync(migrationFilePath, migrationContent);
  
  console.log(`Migration file created at: ${migrationFilePath}`);
  process.exit(0);
}

main(); 