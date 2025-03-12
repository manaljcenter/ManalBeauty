import { NextRequest, NextResponse } from 'next/server';
import { createTreatmentReport, getReportBySessionId, updateTreatmentReport } from '@/lib/services/treatmentService';

export async function GET(
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

export async function POST(
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
    
    // Check if report already exists
    const existingReport = await getReportBySessionId(sessionId);
    
    if (existingReport) {
      return NextResponse.json(
        { message: 'يوجد تقرير بالفعل لهذه الجلسة' },
        { status: 400 }
      );
    }
    
    // Get report data
    const body = await request.json();
    const { report_text, image_url } = body;
    
    // Validate required fields
    if (!report_text) {
      return NextResponse.json(
        { message: 'نص التقرير مطلوب' },
        { status: 400 }
      );
    }
    
    // Create the report
    const report = await createTreatmentReport({
      treatment_session_id: sessionId,
      report_text,
      image_url
    });
    
    return NextResponse.json({
      message: 'تم إنشاء تقرير العلاج بنجاح',
      report
    });
  } catch (error) {
    console.error('Error creating treatment report:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء تقرير العلاج' },
      { status: 500 }
    );
  }
}

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
    
    // Check if report exists
    const existingReport = await getReportBySessionId(sessionId);
    
    if (!existingReport) {
      return NextResponse.json(
        { message: 'لم يتم العثور على تقرير لهذه الجلسة' },
        { status: 404 }
      );
    }
    
    // Get update data
    const body = await request.json();
    const { report_text, image_url } = body;
    
    // Update the report
    const updatedReport = await updateTreatmentReport(existingReport.id, {
      report_text,
      image_url
    });
    
    return NextResponse.json({
      message: 'تم تحديث تقرير العلاج بنجاح',
      report: updatedReport
    });
  } catch (error) {
    console.error('Error updating treatment report:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث تقرير العلاج' },
      { status: 500 }
    );
  }
} 