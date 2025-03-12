import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
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
    
    // Get treatment plans for client
    const supabase = createClient();
    const { data: treatmentPlans, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching treatment plans:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب خطط العلاج' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      treatmentPlans: treatmentPlans || []
    });
  } catch (error) {
    console.error('Error fetching treatment plans:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب خطط العلاج' },
      { status: 500 }
    );
  }
} 