require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

// Check if email and password are provided
if (!email || !password) {
  console.error('Usage: node test-authenticate-client.js <email> <password>');
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

async function getClientByEmail(email) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, try to get all clients with this email
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching client by email:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log('No client found with email:', email);
      return null;
    }
    
    if (data.length > 1) {
      console.log(`Warning: Found ${data.length} clients with email ${email}. Using the first one.`);
    }
    
    // Return the first client
    return data[0];
  } catch (error) {
    console.error('Unexpected error in getClientByEmail:', error);
    return null;
  }
}

async function verifyClientPassword(client, password) {
  try {
    if (!client.password) {
      console.error('Client has no password');
      return false;
    }
    
    return await bcrypt.compare(password, client.password);
  } catch (error) {
    console.error('Error verifying client password:', error);
    return false;
  }
}

async function authenticateClient(email, password) {
  try {
    console.log(`Authenticating client with email: ${email}`);
    
    // Get client by email
    const client = await getClientByEmail(email);
    
    if (!client) {
      console.error('Client not found with email:', email);
      return null;
    }
    
    console.log('Client found:', {
      id: client.id,
      name: client.name,
      email: client.email,
      hasPassword: !!client.password
    });
    
    // Verify password
    const isPasswordValid = await verifyClientPassword(client, password);
    
    if (!isPasswordValid) {
      console.error('Invalid password for client:', email);
      return null;
    }
    
    console.log('Password verified successfully');
    
    // Return client without password
    const { password: _, ...clientWithoutPassword } = client;
    return clientWithoutPassword;
  } catch (error) {
    console.error('Unexpected error in authenticateClient:', error);
    return null;
  }
}

async function main() {
  console.log('===== AUTHENTICATE CLIENT TEST =====');
  
  try {
    const client = await authenticateClient(email, password);
    
    if (client) {
      console.log('\n✅ Authentication successful');
      console.log('Client details:', {
        id: client.id,
        name: client.name,
        email: client.email
      });
    } else {
      console.log('\n❌ Authentication failed');
    }
  } catch (error) {
    console.error('\n❌ Error during authentication test:', error);
  }
}

main(); 