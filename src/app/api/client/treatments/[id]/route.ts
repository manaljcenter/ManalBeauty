import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTreatmentPlanById } from '@/lib/services/treatmentService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get client session cookie
    const cookieStore = cookies();
    const clientSessionCookie = cookieStore.get('client-session');
    
    if (!clientSessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Parse the session to get client ID
    const session = JSON.parse(clientSessionCookie.value);
    const clientId = session.clientId;

    if (!clientId) {
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    // Get treatment plan ID from params
    const treatmentPlanId = params.id;
    
    if (!treatmentPlanId) {
      return NextResponse.json(
        { message: 'معرف خطة العلاج مطلوب' },
        { status: 400 }
      );
    }

    // Fetch the treatment plan
    const treatmentPlan = await getTreatmentPlanById(treatmentPlanId);
    
    if (!treatmentPlan) {
      return NextResponse.json(
        { message: 'لم يتم العثور على خطة العلاج' },
        { status: 404 }
      );
    }

    // Verify that the treatment plan belongs to the client
    if (treatmentPlan.client_id !== clientId) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول إلى خطة العلاج هذه' },
        { status: 403 }
      );
    }

    return NextResponse.json(treatmentPlan);
  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب خطة العلاج' },
      { status: 500 }
    );
  }
} 