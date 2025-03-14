require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key is missing in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUpload() {
  try {
    console.log('Testing Supabase storage upload functionality...');
    
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    const servicesBucketExists = buckets.some(bucket => bucket.name === 'services');
    
    if (!servicesBucketExists) {
      console.error('Error: "services" bucket does not exist. Please run setup-storage.js first.');
      process.exit(1);
    }
    
    console.log('"services" bucket exists.');
    
    // Create a small 1x1 pixel PNG image (base64 encoded)
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testFilePath, imageBuffer);
    
    console.log('Uploading test image to Supabase storage...');
    
    // Upload the test file
    const fileContent = fs.readFileSync(testFilePath);
    const { error: uploadError } = await supabase.storage
      .from('services')
      .upload('test/test-image.png', fileContent, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Error uploading test image: ${uploadError.message}`);
    }
    
    console.log('Test image uploaded successfully.');
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('services')
      .getPublicUrl('test/test-image.png');
    
    console.log('Public URL:', publicUrlData.publicUrl);
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
    // Delete the test file from storage
    const { error: deleteError } = await supabase.storage
      .from('services')
      .remove(['test/test-image.png']);
    
    if (deleteError) {
      console.warn(`Warning: Could not delete test image: ${deleteError.message}`);
    } else {
      console.log('Test image deleted from storage.');
    }
    
    console.log('Storage upload test completed successfully!');
  } catch (error) {
    console.error('Error testing storage upload:', error);
    process.exit(1);
  }
}

testUpload(); 