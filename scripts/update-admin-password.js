const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

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
      role: user.role
    });
    
    // Hash the new password
    const newPassword = 'Manal@2019';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Generated new password hash');
    
    // Update the admin user's password
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating admin password:', updateError);
      process.exit(1);
    }
    
    console.log('Admin password updated successfully!');
    console.log('You can now log in with:');
    console.log('Email: admin@manalbeauty.com');
    console.log('Password: Manal@2019');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 