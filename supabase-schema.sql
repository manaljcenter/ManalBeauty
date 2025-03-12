-- Create enum types
CREATE TYPE service_category AS ENUM ('facial', 'hair_removal', 'skin_treatment', 'massage', 'other');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  category service_category NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  time TIME NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for admin access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing admin user if exists to ensure clean state
DELETE FROM users WHERE email = 'admin@manalbeauty.com';

-- Insert a default admin user (password: admin123)
-- This hash is generated with bcryptjs using 10 rounds
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@manalbeauty.com',
  '$2a$10$XQtKGOhOgxCVVxR4vFcB8eVhqW9xMqHDEVMkzFkFQ.8AUMoBnH3Oe',
  'admin'
);

-- Insert sample services
INSERT INTO services (name, description, price, duration, category, image)
VALUES 
  ('تنظيف البشرة العميق', 'تنظيف عميق للبشرة لإزالة الشوائب والرؤوس السوداء', 150.00, 60, 'facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1470&auto=format&fit=crop'),
  ('إزالة الشعر بالشمع', 'إزالة الشعر بالشمع للساقين والذراعين', 120.00, 45, 'hair_removal', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1470&auto=format&fit=crop'),
  ('تقشير الوجه بالفواكه', 'تقشير الوجه باستخدام أحماض الفواكه الطبيعية', 180.00, 50, 'skin_treatment', 'https://images.unsplash.com/photo-1596178060810-72660ee8d98e?q=80&w=1470&auto=format&fit=crop'),
  ('مساج استرخائي', 'مساج كامل للجسم للاسترخاء وتخفيف التوتر', 200.00, 90, 'massage', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1470&auto=format&fit=crop'),
  ('علاج حب الشباب', 'علاج متخصص لحب الشباب والبثور', 160.00, 60, 'skin_treatment', 'https://images.unsplash.com/photo-1612908689356-3b6eb8b5d9fb?q=80&w=1470&auto=format&fit=crop')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 