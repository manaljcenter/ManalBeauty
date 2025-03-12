const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');
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

    console.log('Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    console.log('Creating admin user...');
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@manalbeauty.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;

    // Insert sample services
    console.log('Creating sample services...');
    const services = [
      {
        name: 'تنظيف البشرة العميق',
        description: 'تنظيف عميق للبشرة لإزالة الشوائب والرؤوس السوداء',
        price: 150,
        duration: 60,
        category: 'facial',
      },
      {
        name: 'علاج حب الشباب',
        description: 'علاج متخصص لحب الشباب والبثور',
        price: 200,
        duration: 45,
        category: 'skin_treatment',
      },
      {
        name: 'إزالة الشعر بالليزر',
        description: 'إزالة الشعر بالليزر للوجه',
        price: 250,
        duration: 30,
        category: 'hair_removal',
      },
      {
        name: 'تقشير كيميائي',
        description: 'تقشير كيميائي لتجديد خلايا البشرة',
        price: 300,
        duration: 45,
        category: 'facial',
      },
      {
        name: 'ميزوثيرابي للوجه',
        description: 'علاج الميزوثيرابي لنضارة البشرة',
        price: 350,
        duration: 60,
        category: 'skin_treatment',
      },
    ];

    for (const service of services) {
      await sql`
        INSERT INTO services (name, description, price, duration, category)
        VALUES (${service.name}, ${service.description}, ${service.price}, ${service.duration}, ${service.category})
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('Database seeded successfully');
    
    // Close the connection
    await sql.end();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main(); 