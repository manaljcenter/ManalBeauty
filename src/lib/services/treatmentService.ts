import { supabase } from '@/lib/supabase';

export interface TreatmentPlan {
  id: string;
  client_id: string;
  total_sessions: number;
  completed_sessions: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TreatmentSession {
  id: string;
  treatment_plan_id: string;
  client_id: string;
  session_number: number;
  date: string;
  time: string | null;
  status: string;
  notes: string | null;
  treatment_performed: string | null;
  results: string | null;
  report_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TreatmentReport {
  id: string;
  treatment_session_id: string;
  report_text: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new treatment plan
 */
export async function createTreatmentPlan(planData: {
  client_id: string;
  total_sessions: number;
  notes?: string;
}): Promise<TreatmentPlan> {
  const { data, error } = await supabase
    .from('treatment_plans')
    .insert([{
      ...planData,
      completed_sessions: 0,
      status: 'active',
      notes: planData.notes || ''
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating treatment plan:', error);
    throw new Error('فشل في إنشاء خطة العلاج');
  }

  return data;
}

/**
 * Get a treatment plan by ID
 */
export async function getTreatmentPlanById(planId: string): Promise<TreatmentPlan | null> {
  const { data, error } = await supabase
    .from('treatment_plans')
    .select('*')
    .eq('id', planId)
    .single();
  
  if (error) {
    console.error('Error fetching treatment plan:', error);
    return null;
  }
  
  return data;
}

/**
 * Get all treatment plans for a client
 */
export async function getTreatmentPlansByClientId(clientId: string): Promise<TreatmentPlan[]> {
  const { data, error } = await supabase
    .from('treatment_plans')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching treatment plans:', error);
    throw new Error('Failed to fetch treatment plans');
  }
  
  return data || [];
}

/**
 * Update a treatment plan
 */
export async function updateTreatmentPlan(
  id: string,
  planData: Partial<TreatmentPlan>
): Promise<TreatmentPlan> {
  const { data, error } = await supabase
    .from('treatment_plans')
    .update(planData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating treatment plan:', error);
    throw new Error('فشل في تحديث خطة العلاج');
  }

  return data;
}

/**
 * Create a new treatment session
 */
export async function createTreatmentSession(sessionData: {
  treatment_plan_id: string;
  session_number: number;
  session_date: string;
  session_time: string;
  notes?: string;
}): Promise<TreatmentSession> {
  const { data, error } = await supabase
    .from('treatment_sessions')
    .insert([{
      ...sessionData,
      status: 'scheduled',
      notes: sessionData.notes || ''
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating treatment session:', error);
    throw new Error('فشل في إنشاء جلسة العلاج');
  }

  return data;
}

/**
 * Get all sessions for a treatment plan
 */
export async function getSessionsByTreatmentPlanId(planId: string): Promise<TreatmentSession[]> {
  const { data, error } = await supabase
    .from('treatment_sessions')
    .select('*')
    .eq('treatment_plan_id', planId)
    .order('session_number', { ascending: true });
  
  if (error) {
    console.error('Error fetching treatment sessions:', error);
    throw new Error('Failed to fetch treatment sessions');
  }
  
  return data || [];
}

/**
 * Get a specific treatment session by ID
 */
export async function getTreatmentSessionById(sessionId: string): Promise<TreatmentSession | null> {
  const { data, error } = await supabase
    .from('treatment_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  
  if (error) {
    console.error('Error fetching treatment session:', error);
    return null;
  }
  
  return data;
}

/**
 * Update a treatment session
 */
export async function updateTreatmentSession(
  sessionId: string, 
  updates: Partial<TreatmentSession>
): Promise<TreatmentSession | null> {
  const { data, error } = await supabase
    .from('treatment_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating treatment session:', error);
    throw new Error('Failed to update treatment session');
  }
  
  return data;
}

/**
 * Create a treatment report
 */
export async function createTreatmentReport(
  report: Omit<TreatmentReport, 'id' | 'created_at' | 'updated_at'>
): Promise<TreatmentReport | null> {
  const { data, error } = await supabase
    .from('treatment_reports')
    .insert(report)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating treatment report:', error);
    throw new Error('Failed to create treatment report');
  }
  
  // Update the session to link to this report
  await updateTreatmentSession(report.treatment_session_id, {
    report_id: data.id
  });
  
  return data;
}

/**
 * Get a report by session ID
 */
export async function getReportBySessionId(sessionId: string): Promise<TreatmentReport | null> {
  const { data, error } = await supabase
    .from('treatment_reports')
    .select('*')
    .eq('treatment_session_id', sessionId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching treatment report:', error);
    throw new Error('Failed to fetch treatment report');
  }
  
  return data;
}

/**
 * Get a report by ID
 */
export async function getReportById(reportId: string): Promise<TreatmentReport | null> {
  const { data, error } = await supabase
    .from('treatment_reports')
    .select('*')
    .eq('id', reportId)
    .single();
  
  if (error) {
    console.error('Error fetching treatment report:', error);
    return null;
  }
  
  return data;
}

/**
 * Update a treatment report
 */
export async function updateTreatmentReport(
  reportId: string,
  updates: Partial<Omit<TreatmentReport, 'id' | 'treatment_session_id' | 'created_at' | 'updated_at'>>
): Promise<TreatmentReport | null> {
  const { data, error } = await supabase
    .from('treatment_reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating treatment report:', error);
    throw new Error('Failed to update treatment report');
  }
  
  return data;
} 