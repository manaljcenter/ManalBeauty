import { NextRequest, NextResponse } from 'next/server';
import { getSessionsByTreatmentPlanId, getTreatmentPlanById } from '@/lib/services/treatmentService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treatmentPlanId = params.id;
    
    // Get client ID from session cookie
    const clientSession = request.cookies.get('client-session')?.value;
    
    if (!clientSession) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(clientSession);
    const clientId = session.id;
    
    // Verify that the treatment plan belongs to the client
    const treatmentPlan = await getTreatmentPlanById(treatmentPlanId);
    
    if (!treatmentPlan) {
      return NextResponse.json(
        { message: 'لم يتم العثور على خطة العلاج' },
        { status: 404 }
      );
    }
    
    if (treatmentPlan.client_id !== clientId) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول إلى هذه الخطة' },
        { status: 403 }
      );
    }
    
    // Get sessions for the treatment plan
    const sessions = await getSessionsByTreatmentPlanId(treatmentPlanId);
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching treatment sessions:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب جلسات العلاج' },
      { status: 500 }
    );
  }
} 