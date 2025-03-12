require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key is missing in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' }
});

async function createClientTables() {
  try {
    console.log('Creating client tables directly...');

    // Create clients table
    console.log('Creating clients table...');
    const { error: clientsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (clientsError) {
      console.error('Error creating clients table:', clientsError);
    } else {
      console.log('Clients table created successfully');
    }

    // Create treatment_plans table
    console.log('Creating treatment_plans table...');
    const { error: plansError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS treatment_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL,
        total_sessions INTEGER NOT NULL DEFAULT 1,
        completed_sessions INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (plansError) {
      console.error('Error creating treatment_plans table:', plansError);
    } else {
      console.log('Treatment plans table created successfully');
    }

    // Create treatment_sessions table
    console.log('Creating treatment_sessions table...');
    const { error: sessionsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS treatment_sessions (
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
    `);
    
    if (sessionsError) {
      console.error('Error creating treatment_sessions table:', sessionsError);
    } else {
      console.log('Treatment sessions table created successfully');
    }

    // Create treatment_reports table
    console.log('Creating treatment_reports table...');
    const { error: reportsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS treatment_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        treatment_session_id UUID NOT NULL,
        report_text TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (reportsError) {
      console.error('Error creating treatment_reports table:', reportsError);
    } else {
      console.log('Treatment reports table created successfully');
    }

    // Add foreign key constraints
    console.log('Adding foreign key constraints...');
    const { error: fkError1 } = await supabase.query(`
      ALTER TABLE treatment_plans 
      ADD CONSTRAINT fk_treatment_plans_client 
      FOREIGN KEY (client_id) 
      REFERENCES clients(id) 
      ON DELETE CASCADE;
    `);
    
    if (fkError1) {
      console.error('Error adding foreign key to treatment_plans:', fkError1);
    }

    const { error: fkError2 } = await supabase.query(`
      ALTER TABLE treatment_sessions 
      ADD CONSTRAINT fk_treatment_sessions_plan 
      FOREIGN KEY (treatment_plan_id) 
      REFERENCES treatment_plans(id) 
      ON DELETE CASCADE;
    `);
    
    if (fkError2) {
      console.error('Error adding foreign key to treatment_sessions (plan):', fkError2);
    }

    const { error: fkError3 } = await supabase.query(`
      ALTER TABLE treatment_sessions 
      ADD CONSTRAINT fk_treatment_sessions_client 
      FOREIGN KEY (client_id) 
      REFERENCES clients(id) 
      ON DELETE CASCADE;
    `);
    
    if (fkError3) {
      console.error('Error adding foreign key to treatment_sessions (client):', fkError3);
    }

    const { error: fkError4 } = await supabase.query(`
      ALTER TABLE treatment_sessions 
      ADD CONSTRAINT fk_treatment_sessions_report 
      FOREIGN KEY (report_id) 
      REFERENCES treatment_reports(id) 
      ON DELETE SET NULL;
    `);
    
    if (fkError4) {
      console.error('Error adding foreign key to treatment_sessions (report):', fkError4);
    }

    const { error: fkError5 } = await supabase.query(`
      ALTER TABLE treatment_reports 
      ADD CONSTRAINT fk_treatment_reports_session 
      FOREIGN KEY (treatment_session_id) 
      REFERENCES treatment_sessions(id) 
      ON DELETE CASCADE;
    `);
    
    if (fkError5) {
      console.error('Error adding foreign key to treatment_reports:', fkError5);
    }

    // Create updated_at function and triggers
    console.log('Creating updated_at function and triggers...');
    const { error: funcError } = await supabase.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    if (funcError) {
      console.error('Error creating update_updated_at_column function:', funcError);
    }

    const { error: triggerError1 } = await supabase.query(`
      CREATE TRIGGER update_clients_updated_at
      BEFORE UPDATE ON clients
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    if (triggerError1) {
      console.error('Error creating clients trigger:', triggerError1);
    }

    const { error: triggerError2 } = await supabase.query(`
      CREATE TRIGGER update_treatment_plans_updated_at
      BEFORE UPDATE ON treatment_plans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    if (triggerError2) {
      console.error('Error creating treatment_plans trigger:', triggerError2);
    }

    const { error: triggerError3 } = await supabase.query(`
      CREATE TRIGGER update_treatment_sessions_updated_at
      BEFORE UPDATE ON treatment_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    if (triggerError3) {
      console.error('Error creating treatment_sessions trigger:', triggerError3);
    }

    const { error: triggerError4 } = await supabase.query(`
      CREATE TRIGGER update_treatment_reports_updated_at
      BEFORE UPDATE ON treatment_reports
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    if (triggerError4) {
      console.error('Error creating treatment_reports trigger:', triggerError4);
    }

    console.log('Client tables setup completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createClientTables(); 