-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_plans table
CREATE TABLE IF NOT EXISTS treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 1,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_sessions table
CREATE TABLE IF NOT EXISTS treatment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  treatment_performed TEXT,
  results TEXT,
  report_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_reports table
CREATE TABLE IF NOT EXISTS treatment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_session_id UUID NOT NULL REFERENCES treatment_sessions(id) ON DELETE CASCADE,
  report_text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for report_id in treatment_sessions
ALTER TABLE treatment_sessions 
ADD CONSTRAINT fk_treatment_sessions_report 
FOREIGN KEY (report_id) 
REFERENCES treatment_reports(id) 
ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_treatment_plans_client_id ON treatment_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_sessions_treatment_plan_id ON treatment_sessions(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_treatment_sessions_client_id ON treatment_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_reports_treatment_session_id ON treatment_reports(treatment_session_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
BEFORE UPDATE ON treatment_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_sessions_updated_at
BEFORE UPDATE ON treatment_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_reports_updated_at
BEFORE UPDATE ON treatment_reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 