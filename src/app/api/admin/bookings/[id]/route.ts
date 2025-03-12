import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBookingById } from '@/lib/services/bookingService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // Get booking details
    const booking = await getBookingById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { message: 'الحجز غير موجود' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب تفاصيل الحجز' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['client_name', 'client_phone', 'service_id', 'date', 'time', 'status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `الحقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: 'حالة الحجز غير صالحة' },
        { status: 400 }
      );
    }
    
    // Update booking
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .update({
        client_name: body.client_name,
        client_phone: body.client_phone,
        client_email: body.client_email || null,
        service_id: body.service_id,
        date: body.date,
        time: body.time,
        notes: body.notes || '',
        status: body.status
      })
      .eq('id', bookingId)
      .select(`
        *,
        services (*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء تحديث الحجز' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'تم تحديث الحجز بنجاح',
      booking: data
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الحجز' },
      { status: 500 }
    );
  }
} 