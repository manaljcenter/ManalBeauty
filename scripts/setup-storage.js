require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key is missing in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage for service images...');
    
    // Check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    const servicesBucketExists = buckets.some(bucket => bucket.name === 'services');
    
    // Create the bucket if it doesn't exist
    if (!servicesBucketExists) {
      console.log('Creating "services" bucket...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('services', {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        });
      
      if (createBucketError) {
        throw new Error(`Error creating bucket: ${createBucketError.message}`);
      }
      
      console.log('Successfully created "services" bucket.');
    } else {
      console.log('"services" bucket already exists.');
    }
    
    // Update bucket to be public
    console.log('Updating bucket policies...');
    const { error: updateBucketError } = await supabase
      .storage
      .updateBucket('services', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      });
    
    if (updateBucketError) {
      throw new Error(`Error updating bucket: ${updateBucketError.message}`);
    }
    
    console.log('Successfully updated bucket policies.');
    
    console.log('Storage setup completed successfully!');
  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage(); 