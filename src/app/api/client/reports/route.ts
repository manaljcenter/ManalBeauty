import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get client session
    const sessionCookie = request.cookies.get('client-session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح به' },
        { status: 401 }
      );
    }
    
    // Parse client session
    const session = JSON.parse(sessionCookie.value);
    const clientId = session.clientId;
    
    // Get reports from Supabase
    const supabase = createClient();
    const { data: reports, error } = await supabase
      .from('client_reports')
      .select(`
        *,
        treatment_sessions (
          *,
          treatment_plans (*)
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching client reports:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب التقارير' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(reports || []);
  } catch (error) {
    console.error('Error in GET /api/client/reports:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
} 