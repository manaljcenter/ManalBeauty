const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Get email and password from command line arguments
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error('Please provide an email address and password as arguments');
    console.error('Example: node scripts/update-client-password.js test@example.com newpassword123');
    process.exit(1);
  }

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log(`Updating password for client with email: ${email}`);
    
    // First, get the client by email
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();
    
    if (clientError) {
      console.error('Error fetching client:', clientError.message);
      process.exit(1);
    }
    
    if (!client) {
      console.error('Client not found with email:', email);
      process.exit(1);
    }
    
    console.log('Client found:', {
      id: client.id,
      name: client.name,
      email: client.email
    });
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('New password hash generated');
    
    // Update the client's password
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update({ password: hashedPassword })
      .eq('id', client.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating client password:', updateError.message);
      process.exit(1);
    }
    
    console.log('Client password updated successfully!');
    
    // Also update the password in Supabase Auth if possible
    try {
      // First, check if the user exists in Supabase Auth
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError.message);
      } else {
        const existingUser = users.find(user => user.email === email);
        
        if (existingUser) {
          console.log('Updating password in Supabase Auth...');
          
          const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password }
          );
          
          if (authUpdateError) {
            console.error('Error updating password in Supabase Auth:', authUpdateError.message);
          } else {
            console.log('Password updated in Supabase Auth successfully!');
          }
        } else {
          console.log('User not found in Supabase Auth. Only updated in clients table.');
        }
      }
    } catch (authError) {
      console.error('Error updating password in Supabase Auth:', authError.message);
      console.log('Password was only updated in the clients table.');
    }
    
    // Verify the new password
    const isPasswordValid = await bcrypt.compare(password, updatedClient.password);
    console.log('Password verification after update:', isPasswordValid ? 'Successful' : 'Failed');
    
    if (isPasswordValid) {
      console.log('\nYou can now log in with:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } else {
      console.error('Password verification failed! Something went wrong with the update.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 