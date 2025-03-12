-- Create clients table only
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test client
INSERT INTO clients (name, email, phone, password)
VALUES (
  'Test Client',
  'testclient@example.com',
  '1234567890',
  '$2a$10$XQiGKc3uxaJ0KgEMaUu.9.xyJX1JB0gk7qlBEtQXXQxU5KxZ8tdHC' -- password: password123
)
ON CONFLICT (email) DO NOTHING; 