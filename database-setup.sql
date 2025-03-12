-- Create enums
DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('facial', 'hair_removal', 'skin_treatment', 'massage', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration INTEGER,
  category service_category,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  service_id INTEGER REFERENCES services(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  date TIMESTAMP NOT NULL,
  time TEXT NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  birthdate TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@manalbeauty.com', '$2a$10$XvXWZ3sOOuEEDK1JjQJHxeQB5xHBVXU5xJKYHWy.tGrk4.yhdYxlC', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, price, duration, category)
VALUES 
  ('تنظيف البشرة العميق', 'تنظيف عميق للبشرة لإزالة الشوائب والرؤوس السوداء', 150, 60, 'facial'),
  ('علاج حب الشباب', 'علاج متخصص لحب الشباب والبثور', 200, 45, 'skin_treatment'),
  ('إزالة الشعر بالليزر', 'إزالة الشعر بالليزر للوجه', 250, 30, 'hair_removal'),
  ('تقشير كيميائي', 'تقشير كيميائي لتجديد خلايا البشرة', 300, 45, 'facial'),
  ('ميزوثيرابي للوجه', 'علاج الميزوثيرابي لنضارة البشرة', 350, 60, 'skin_treatment')
ON CONFLICT DO NOTHING; 