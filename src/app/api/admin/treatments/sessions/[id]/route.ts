import { NextRequest, NextResponse } from 'next/server';
import { updateTreatmentSession } from '@/lib/services/treatmentService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
    // Verify admin session
    const adminSession = request.cookies.get('session')?.value;
    
    if (!adminSession) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(adminSession);
    
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 403 }
      );
    }
    
    // Get update data
    const body = await request.json();
    const { status, notes, session_date, session_time } = body;
    
    // Update the session
    const updatedSession = await updateTreatmentSession(sessionId, {
      status,
      notes,
      date: session_date,
      time: session_time
    });
    
    return NextResponse.json({
      message: 'تم تحديث جلسة العلاج بنجاح',
      session: updatedSession
    });
  } catch (error) {
    console.error('Error updating treatment session:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث جلسة العلاج' },
      { status: 500 }
    );
  }
} 