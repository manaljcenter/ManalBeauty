import { NextRequest, NextResponse } from 'next/server';
import { getTreatmentSessionById, getReportBySessionId } from '@/lib/services/treatmentService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
    // Verify session exists
    const session = await getTreatmentSessionById(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { message: 'جلسة العلاج غير موجودة' },
        { status: 404 }
      );
    }
    
    // Get report for the session
    const report = await getReportBySessionId(sessionId);
    
    return NextResponse.json({
      session,
      report
    });
  } catch (error) {
    console.error('Error fetching treatment session report:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب تقرير جلسة العلاج' },
      { status: 500 }
    );
  }
} 