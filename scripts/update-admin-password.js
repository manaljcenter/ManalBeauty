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
    
    // Generate a new password hash
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('New password hash generated:', hashedPassword);
    
    // Update the user's password in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error updating admin password:', updateError);
      process.exit(1);
    }
    
    console.log('Admin password updated successfully!');
    
    // Verify the new password
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching updated user:', fetchError);
      process.exit(1);
    }
    
    const isPasswordValid = await bcrypt.compare(password, updatedUser.password);
    console.log('Password verification after update:', isPasswordValid);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 