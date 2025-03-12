import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    
    // Get client session from cookie
    const sessionCookie = request.cookies.get('client-session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح به' },
        { status: 401 }
      );
    }
    
    // Parse session
    const session = JSON.parse(sessionCookie.value);
    const clientId = session.clientId;
    
    // Get report with session information
    const supabase = createClient();
    const { data: report, error } = await supabase
      .from('treatment_reports')
      .select(`
        *,
        session:treatment_session_id (
          id,
          treatment_plan_id,
          session_number,
          date,
          time,
          client_id
        )
      `)
      .eq('id', reportId)
      .single();
    
    if (error) {
      console.error('Error fetching report:', error);
      return NextResponse.json(
        { message: 'التقرير غير موجود' },
        { status: 404 }
      );
    }
    
    // Verify the report belongs to the client
    if (report.session.client_id !== clientId) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول إلى هذا التقرير' },
        { status: 403 }
      );
    }
    
    // Remove client_id from session for security
    if (report.session) {
      delete report.session.client_id;
    }
    
    return NextResponse.json({
      report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب التقرير' },
      { status: 500 }
    );
  }
} 