require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

// Check if email and password are provided
if (!email || !password) {
  console.error('Usage: node debug-client-login.js <email> <password>');
  process.exit(1);
}

// Check if Supabase credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in environment variables!');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

async function main() {
  console.log('===== CLIENT LOGIN DEBUG =====');
  console.log(`Testing login for email: ${email}`);
  
  try {
    // Initialize Supabase client
    console.log('\n1. Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
    
    // Step 1: Check if the client exists in the database
    console.log('\n2. Checking if client exists in database...');
    const { data: clientsArray, error: listError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email);
    
    if (listError) {
      console.error('❌ Error querying clients:', listError.message);
      return;
    }
    
    if (!clientsArray || clientsArray.length === 0) {
      console.error(`❌ Client with email ${email} not found in database!`);
      return;
    }
    
    if (clientsArray.length > 1) {
      console.log(`⚠️ Warning: Found ${clientsArray.length} clients with email ${email}`);
      console.log('Using the first client for testing:');
    }
    
    // Use the first client
    const client = clientsArray[0];
    console.log('✅ Client found in database');
    console.log('Client details:', {
      id: client.id,
      name: client.name,
      email: client.email,
      hasPassword: !!client.password,
      passwordLength: client.password ? client.password.length : 0
    });
    
    // Step 2: Check if password is hashed correctly
    console.log('\n3. Checking password format...');
    if (!client.password) {
      console.error('❌ Client does not have a password field');
      return;
    }
    
    const passwordRegex = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
    if (!passwordRegex.test(client.password)) {
      console.error('❌ Password does not appear to be properly hashed with bcrypt');
      console.log('Password format:', client.password.substring(0, 10) + '...');
      return;
    }
    
    console.log('✅ Password is properly hashed with bcrypt');
    
    // Step 3: Verify password directly
    console.log('\n4. Verifying password...');
    try {
      const isPasswordValid = await bcrypt.compare(password, client.password);
      
      if (isPasswordValid) {
        console.log('✅ Password is valid when checked directly with bcrypt');
      } else {
        console.error('❌ Password is invalid when checked directly with bcrypt');
        console.error('   This suggests the stored password hash does not match the provided password.');
        return;
      }
    } catch (bcryptError) {
      console.error('❌ Error during bcrypt password comparison:', bcryptError);
      return;
    }
    
    // Step 4: Simulate the authenticateClient function
    console.log('\n5. Simulating authenticateClient function...');
    
    // Return client without password
    const { password: _, ...clientWithoutPassword } = client;
    console.log('✅ Authentication successful');
    console.log('Client details (without password):', clientWithoutPassword);
    
    // Step 5: Simulate cookie creation
    console.log('\n6. Simulating cookie creation...');
    const sessionData = {
      clientId: client.id,
      email: client.email,
      name: client.name
    };
    
    console.log('Session data that would be stored in cookie:', sessionData);
    console.log('JSON string length:', JSON.stringify(sessionData).length);
    console.log('✅ Cookie simulation successful');
    
    console.log('\n===== SUMMARY =====');
    console.log('✅ All checks passed. The client login process should work correctly.');
    console.log('If you are still experiencing issues, check the following:');
    console.log('1. Is the Next.js server running?');
    console.log('2. Are there any network issues or CORS problems?');
    console.log('3. Check the server logs for any errors during the login process.');
    console.log('4. Verify that the client-side code is sending the correct request format.');
    
  } catch (error) {
    console.error('\n❌ Unexpected error during debug process:', error);
  }
}

main(); 