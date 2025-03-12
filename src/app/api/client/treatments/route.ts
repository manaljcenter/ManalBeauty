import { NextRequest, NextResponse } from 'next/server';
import { getTreatmentPlansByClientId } from '@/lib/services/treatmentService';

export async function GET(request: NextRequest) {
  try {
    // Get client ID from session cookie
    const clientSession = request.cookies.get('client-session')?.value;
    
    if (!clientSession) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(clientSession);
    const clientId = session.clientId;
    
    if (!clientId) {
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    // Get treatment plans for client
    const treatmentPlans = await getTreatmentPlansByClientId(clientId);
    
    return NextResponse.json(treatmentPlans);
  } catch (error) {
    console.error('Error fetching client treatment plans:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب خطط العلاج' },
      { status: 500 }
    );
  }
} 