require('dotenv').config({ path: '.env.local' });

// List of required environment variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'BASE_URL'
];

// Check if all required variables are set
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set!');
  
  // Print the values (masking sensitive information)
  console.log('\nEnvironment variables:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    // Mask sensitive keys
    const maskedValue = varName.includes('KEY') 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
      : value;
    console.log(`${varName}=${maskedValue}`);
  });
} else {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`- ${varName}`);
  });
  
  console.log('\nPlease add these variables to your .env.local file and to your Netlify environment variables.');
  console.log('\nFor Netlify, you can set them using the Netlify CLI:');
  missingVars.forEach(varName => {
    console.log(`netlify env:set ${varName} "your-value-here"`);
  });
  
  console.log('\nOr through the Netlify UI:');
  console.log('1. Go to your site settings in Netlify');
  console.log('2. Navigate to "Environment variables"');
  console.log('3. Add each missing variable with its value');
  
  process.exit(1);
}

// Check if storage bucket is set up
console.log('\nChecking Supabase storage bucket...');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStorage() {
  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    const servicesBucketExists = buckets.some(bucket => bucket.name === 'services');
    
    if (servicesBucketExists) {
      console.log('✅ "services" storage bucket exists');
    } else {
      console.log('❌ "services" storage bucket does not exist');
      console.log('\nRun the following command to set up the storage bucket:');
      console.log('node scripts/setup-storage.js');
    }
  } catch (error) {
    console.error('Error checking storage:', error);
  }
}

checkStorage(); 