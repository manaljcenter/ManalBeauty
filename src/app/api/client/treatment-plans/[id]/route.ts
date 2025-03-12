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
    
    // Get treatment plan
    const supabase = createClient();
    const { data: treatmentPlan, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('id', treatmentPlanId)
      .eq('client_id', clientId)
      .single();
    
    if (error) {
      console.error('Error fetching treatment plan:', error);
      return NextResponse.json(
        { message: 'خطة العلاج غير موجودة أو غير مصرح بالوصول إليها' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      treatmentPlan
    });
  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب خطة العلاج' },
      { status: 500 }
    );
  }
} 