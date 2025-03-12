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
    // Get the admin user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@manalbeauty.com')
      .single();
    
    if (error) {
      console.error('Error fetching admin user:', error);
      process.exit(1);
    }
    
    if (!user) {
      console.error('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      password: user.password
    });
    
    // Test password verification
    const password = 'admin123';
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('Password verification result:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('Password verification successful!');
    } else {
      console.log('Password verification failed!');
      
      // Generate a new hash for comparison
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash generated:', newHash);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 