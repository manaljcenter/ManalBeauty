require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

// Check if email and password are provided
if (!email || !password) {
  console.error('Usage: node check-client-session.js <email> <password>');
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
  console.log('===== CLIENT SESSION CHECK =====');
  console.log(`Checking session for email: ${email}`);
  
  try {
    // Initialize Supabase client
    console.log('\n1. Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
    
    // Step 1: Get the client from the database
    console.log('\n2. Getting client from database...');
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
    
    // Use the first client
    const client = clientsArray[0];
    console.log('✅ Client found in database');
    console.log('Client details:', {
      id: client.id,
      name: client.name,
      email: client.email
    });
    
    // Step 2: Verify password
    console.log('\n3. Verifying password...');
    if (!client.password) {
      console.error('❌ Client does not have a password field');
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      console.error('❌ Password is invalid');
      return;
    }
    
    console.log('✅ Password is valid');
    
    // Step 3: Create session data
    console.log('\n4. Creating session data...');
    const sessionData = {
      clientId: client.id,
      email: client.email,
      name: client.name
    };
    
    console.log('Session data:', sessionData);
    
    // Step 4: Convert to JSON string
    console.log('\n5. Converting to JSON string...');
    const jsonString = JSON.stringify(sessionData);
    console.log('JSON string:', jsonString);
    console.log('JSON string length:', jsonString.length);
    
    // Step 5: Check cookie format
    console.log('\n6. Checking cookie format...');
    console.log('Cookie name: client-session');
    console.log('Cookie value: ' + jsonString);
    console.log('Cookie options:');
    console.log('  httpOnly: true');
    console.log('  secure: ' + (process.env.NODE_ENV === 'production'));
    console.log('  maxAge: ' + (60 * 60 * 24 * 7) + ' (1 week)');
    console.log('  path: /');
    
    console.log('\n===== SUMMARY =====');
    console.log('✅ Client session check completed successfully');
    console.log('The client session cookie should be set with the above values');
    console.log('If you are still experiencing issues, check the following:');
    console.log('1. Is the cookie being set correctly in the response?');
    console.log('2. Is the middleware correctly checking for the client-session cookie?');
    console.log('3. Is there any issue with the cookie size or format?');
    
  } catch (error) {
    console.error('\n❌ Unexpected error during session check:', error);
  }
}

main(); 