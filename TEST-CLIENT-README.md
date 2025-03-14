# Test Client Scripts

This directory contains scripts to help you test the client and admin login functionality of the application.

## Prerequisites

- Node.js installed
- The application running locally on port 3000

## Available Scripts

### 1. Create a Single Test Client

```bash
node create-test-client.js
```

This script creates a single test client with the following credentials:
- Email: testclient@example.com
- Password: password123

### 2. Test Client Login

```bash
node test-client-login.js
```

This script tests the login functionality using the test client credentials.

### 3. Create Multiple Example Clients

```bash
node create-example-clients.js
```

This script creates multiple example clients with realistic names and contact information. The credentials for all created clients will be displayed in the console output.

### 4. Test Admin Login

```bash
node test-admin-login.js
```

This script tests the admin login functionality using the admin credentials. You may need to update the password in the script to match your actual admin password.

## How to Use

1. Start the application locally:
   ```bash
   npm run dev
   ```

2. In a separate terminal, run one of the scripts:
   ```bash
   node create-example-clients.js
   ```

3. After creating the test clients, you can log in to the application using the credentials displayed in the console.

4. Navigate to http://localhost:3000/client/login or http://localhost:3000/auth/login to test the login functionality.

5. For admin login, use the admin credentials with the email `manaljcenter@gmail.com` and navigate to http://localhost:3000/admin/login or http://localhost:3000/auth/login.

## Example Client Credentials

Here are the example client credentials that will be created:

1. **Sarah Johnson**
   - Email: sarah.johnson@example.com
   - Password: Password123

2. **Mohammed Ali**
   - Email: mohammed.ali@example.com
   - Password: Password123

3. **Fatima Ahmed**
   - Email: fatima.ahmed@example.com
   - Password: Password123

4. **Omar Hassan**
   - Email: omar.hassan@example.com
   - Password: Password123

5. **Layla Ibrahim**
   - Email: layla.ibrahim@example.com
   - Password: Password123

## Admin Credentials

- Email: manaljcenter@gmail.com
- Password: Manal@2019 (You may need to update this in the script)

## Notes

- These scripts are for testing purposes only and should not be used in production.
- The scripts will only work if the application is running locally on port 3000.
- If a client with the same email already exists, the creation will fail.
- The admin login script assumes that the admin account already exists in the database. 