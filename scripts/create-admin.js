require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

async function main() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Generated password hash:', hashedPassword);
    
    // Delete existing admin user if exists
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'admin@manalbeauty.com');
    
    if (deleteError) {
      console.error('Error deleting existing admin user:', deleteError);
    } else {
      console.log('Deleted existing admin user (if any)');
    }
    
    // Create admin user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: 'Admin',
          email: 'admin@manalbeauty.com',
          password: hashedPassword,
          role: 'admin'
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('Admin user created successfully:', data);
    console.log('You can now log in with:');
    console.log('Email: admin@manalbeauty.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 