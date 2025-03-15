const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

// Check if email and password are provided
if (!email || !password) {
  console.error('Usage: node test-api-endpoint.js <email> <password>');
  process.exit(1);
}

async function main() {
  console.log('===== API ENDPOINT TEST =====');
  console.log(`Testing login API for email: ${email}`);
  
  try {
    // Get the base URL from the environment or use localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl}/api/client/login`;
    
    console.log(`Making POST request to ${loginUrl}`);
    console.log(`Request body: ${JSON.stringify({ email, password })}`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout
    
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      // Get response status
      console.log(`Response status: ${response.status}`);
      
      // Get response headers
      console.log('Response headers:');
      response.headers.forEach((value, name) => {
        console.log(`  ${name}: ${value}`);
      });
      
      // Get response body
      const responseText = await response.text();
      console.log('Response body (text):', responseText);
      
      try {
        const responseBody = JSON.parse(responseText);
        console.log('Response body (parsed):', JSON.stringify(responseBody, null, 2));
        
        // Check if login was successful
        if (response.status === 200) {
          console.log('✅ Login API call successful');
        } else {
          console.log('❌ Login API call failed');
          console.log(`   Status code: ${response.status}`);
          console.log(`   Error message: ${responseBody.error || responseBody.message || 'No error message provided'}`);
        }
      } catch (parseError) {
        console.error('❌ Error parsing response as JSON:', parseError.message);
        console.log('Response might not be valid JSON');
      }
    } catch (fetchError) {
      clearTimeout(timeout);
      throw fetchError;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Request timed out after 10 seconds');
      console.error('   This likely means the server is not running or not accessible');
      console.error('   Make sure your Next.js server is running with: npm run dev');
    } else {
      console.error('❌ Error making login API call:', error.message);
      console.error('Error details:', error);
    }
  }
}

main(); 