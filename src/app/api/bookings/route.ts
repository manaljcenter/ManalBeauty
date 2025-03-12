import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, createBooking } from '@/lib/services/bookingService';
import { getServiceById } from '@/lib/services/serviceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_name, client_phone, client_email, service_id, date, time, notes } = body;

    // Validate required fields
    if (!client_name || !client_phone || !service_id || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // Check if service exists
    const service = await getServiceById(service_id);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'الخدمة المطلوبة غير موجودة' },
        { status: 400 }
      );
    }

    // Create booking
    const newBooking = await createBooking({
      client_name,
      client_phone,
      client_email: client_email || '',
      service_id,
      date,
      time,
      notes: notes || '',
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إنشاء الحجز', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await getAllBookings();
    
    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب الحجوزات', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 