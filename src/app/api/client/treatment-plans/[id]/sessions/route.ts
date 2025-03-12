import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treatmentPlanId = params.id;
    
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
    
    // Verify treatment plan belongs to client
    const supabase = createClient();
    const { data: treatmentPlan, error: planError } = await supabase
      .from('treatment_plans')
      .select('id')
      .eq('id', treatmentPlanId)
      .eq('client_id', clientId)
      .single();
    
    if (planError || !treatmentPlan) {
      return NextResponse.json(
        { message: 'خطة العلاج غير موجودة أو غير مصرح بالوصول إليها' },
        { status: 404 }
      );
    }
    
    // Get treatment sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('treatment_sessions')
      .select('*')
      .eq('treatment_plan_id', treatmentPlanId)
      .order('session_number', { ascending: true });
    
    if (sessionsError) {
      console.error('Error fetching treatment sessions:', sessionsError);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب جلسات العلاج' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      sessions: sessions || []
    });
  } catch (error) {
    console.error('Error fetching treatment sessions:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب جلسات العلاج' },
      { status: 500 }
    );
  }
} 