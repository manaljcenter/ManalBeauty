import { NextRequest, NextResponse } from 'next/server';
import { getReportBySessionId, getTreatmentPlanById } from '@/lib/services/treatmentService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
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
    
    // Get the report for the session
    const report = await getReportBySessionId(sessionId);
    
    if (!report) {
      return NextResponse.json(
        { message: 'لم يتم العثور على تقرير لهذه الجلسة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching treatment report:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب تقرير العلاج' },
      { status: 500 }
    );
  }
} 