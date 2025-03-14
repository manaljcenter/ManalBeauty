const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Get email and password from command line arguments
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error('Please provide an email address and password as arguments');
    console.error('Example: node scripts/create-client-user.js user@example.com password123');
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
    console.log(`Creating client user with email: ${email}`);
    
    // First, check if the user already exists in the auth system
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error checking existing users:', getUserError);
      process.exit(1);
    }
    
    const existingUser = users.find(user => user.email === email);
    
    let userId;
    
    if (existingUser) {
      console.log('User already exists in auth system:', {
        id: existingUser.id,
        email: existingUser.email
      });
      
      userId = existingUser.id;
    } else {
      // Create a new user in the auth system
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      
      if (createUserError) {
        console.error('Error creating user in auth system:', createUserError);
        process.exit(1);
      }
      
      console.log('User created in auth system:', {
        id: newUser.user.id,
        email: newUser.user.email
      });
      
      userId = newUser.user.id;
    }
    
    // Check if the user already exists in the clients table
    const { data: existingClient, error: clientCheckError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (clientCheckError && clientCheckError.code !== 'PGRST116') {
      console.error('Error checking existing client:', clientCheckError);
      process.exit(1);
    }
    
    if (existingClient) {
      console.log('Client already exists in clients table:', {
        id: existingClient.id,
        email: existingClient.email,
        name: existingClient.name
      });
      
      // Update the client ID if it doesn't match the auth user ID
      if (existingClient.id !== userId) {
        console.log('Updating client ID to match auth user ID...');
        
        const { error: updateError } = await supabase
          .from('clients')
          .update({ id: userId })
          .eq('id', existingClient.id);
        
        if (updateError) {
          console.error('Error updating client ID:', updateError);
          process.exit(1);
        }
        
        console.log('Client ID updated successfully!');
      }
    } else {
      // Create a new client in the clients table
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: newClient, error: createClientError } = await supabase
        .from('clients')
        .insert({
          id: userId,
          name: 'Client User',
          email,
          phone: '',
          password: hashedPassword
        })
        .select()
        .single();
      
      if (createClientError) {
        console.error('Error creating client in clients table:', createClientError);
        process.exit(1);
      }
      
      console.log('Client created in clients table:', {
        id: newClient.id,
        email: newClient.email,
        name: newClient.name
      });
    }
    
    console.log('\nClient user created successfully!');
    console.log('You can now log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    console.log('\nNext steps:');
    console.log('1. Go to /auth/login');
    console.log('2. Enter your email and password');
    console.log('3. You should be redirected to the client dashboard');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 