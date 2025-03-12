-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_plans table without foreign key constraints initially
CREATE TABLE IF NOT EXISTS public.treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  total_sessions INTEGER NOT NULL DEFAULT 1,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_reports table without foreign key constraints initially
CREATE TABLE IF NOT EXISTS public.treatment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_session_id UUID,
  report_text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_sessions table without foreign key constraints initially
CREATE TABLE IF NOT EXISTS public.treatment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_plan_id UUID NOT NULL,
  client_id UUID NOT NULL,
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

-- Now add all foreign key constraints after all tables are created
ALTER TABLE public.treatment_plans 
ADD CONSTRAINT fk_treatment_plans_client 
FOREIGN KEY (client_id) 
REFERENCES public.clients(id) 
ON DELETE CASCADE;

ALTER TABLE public.treatment_sessions 
ADD CONSTRAINT fk_treatment_sessions_plan 
FOREIGN KEY (treatment_plan_id) 
REFERENCES public.treatment_plans(id) 
ON DELETE CASCADE;

ALTER TABLE public.treatment_sessions 
ADD CONSTRAINT fk_treatment_sessions_client 
FOREIGN KEY (client_id) 
REFERENCES public.clients(id) 
ON DELETE CASCADE;

ALTER TABLE public.treatment_sessions 
ADD CONSTRAINT fk_treatment_sessions_report 
FOREIGN KEY (report_id) 
REFERENCES public.treatment_reports(id) 
ON DELETE SET NULL;

ALTER TABLE public.treatment_reports 
ADD CONSTRAINT fk_treatment_reports_session 
FOREIGN KEY (treatment_session_id) 
REFERENCES public.treatment_sessions(id) 
ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_treatment_plans_client_id ON public.treatment_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_sessions_treatment_plan_id ON public.treatment_sessions(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_treatment_sessions_client_id ON public.treatment_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_reports_treatment_session_id ON public.treatment_reports(treatment_session_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
BEFORE UPDATE ON public.treatment_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_sessions_updated_at
BEFORE UPDATE ON public.treatment_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_reports_updated_at
BEFORE UPDATE ON public.treatment_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a test client
INSERT INTO public.clients (name, email, phone, password)
VALUES (
  'Test Client',
  'testclient@example.com',
  '1234567890',
  '$2a$10$XQiGKc3uxaJ0KgEMaUu.9.xyJX1JB0gk7qlBEtQXXQxU5KxZ8tdHC' -- password: password123
)
ON CONFLICT (email) DO NOTHING; 