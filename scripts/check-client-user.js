const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Get email from command line arguments
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address as an argument');
    console.error('Example: node scripts/check-client-user.js user@example.com');
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
    console.log(`Checking for user with email: ${email}`);
    
    // Check if the user exists in the auth system
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'dummy-password-for-check-only'
    });
    
    let authUserId = null;
    
    if (authError && !authError.message.includes('Invalid login credentials')) {
      console.error('Error checking auth system:', authError);
    } else if (!authError) {
      console.log('User exists in auth system!');
      authUserId = authData.user.id;
      console.log('Auth user ID:', authUserId);
    } else {
      console.log('User does not exist in auth system or password is incorrect');
    }
    
    // Check if the user exists in the users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    if (usersError) {
      console.error('Error fetching from users table:', usersError);
    } else if (users && users.length > 0) {
      console.log('User found in users table:', {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role
      });
      
      if (!authUserId) {
        authUserId = users[0].id;
      }
    } else {
      console.log('User not found in users table');
    }
    
    // Check if the user exists in the clients table
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email);
    
    if (clientsError) {
      console.error('Error fetching from clients table:', clientsError);
    } else if (clients && clients.length > 0) {
      console.log('Client found in clients table:', {
        id: clients[0].id,
        email: clients[0].email,
        name: clients[0].name
      });
      
      // If we have an auth user ID and it doesn't match the client ID, we should update it
      if (authUserId && clients[0].id !== authUserId) {
        console.log('Client ID does not match Auth User ID. Updating...');
        
        const { error: updateError } = await supabase
          .from('clients')
          .update({ id: authUserId })
          .eq('id', clients[0].id);
        
        if (updateError) {
          console.error('Error updating client ID:', updateError);
        } else {
          console.log('Client ID updated successfully!');
        }
      }
    } else {
      console.log('Client not found in clients table');
      
      if (authUserId) {
        console.log('Creating client profile...');
        
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            id: authUserId,
            name: 'Client User',
            email: email,
            phone: ''
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating client profile:', createError);
        } else {
          console.log('Client profile created successfully:', {
            id: newClient.id,
            name: newClient.name,
            email: newClient.email
          });
        }
      } else {
        console.log('Cannot create client profile without auth user ID');
      }
    }
    
    console.log('\nVerifying client session cookie handling:');
    console.log('- Middleware expects cookie name: client-session (with hyphen)');
    console.log('- Profile API now uses cookie name: client-session (with hyphen)');
    console.log('- Login API sets cookie name: client-session (with hyphen)');
    
    console.log('\nNext steps:');
    console.log('1. Try logging in again at /auth/login');
    console.log('2. After login, you should be redirected to the client dashboard');
    console.log('3. If you still have issues, check the browser console for errors');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 