import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
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
    
    // Verify booking belongs to client
    const supabase = createClient();
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('client_id', clientId)
      .single();
    
    if (fetchError || !booking) {
      return NextResponse.json(
        { message: 'الحجز غير موجود أو غير مصرح لك بإلغائه' },
        { status: 404 }
      );
    }
    
    // Check if booking can be canceled (only pending bookings can be canceled)
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { message: 'لا يمكن إلغاء هذا الحجز في حالته الحالية' },
        { status: 400 }
      );
    }
    
    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    
    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء إلغاء الحجز' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'تم إلغاء الحجز بنجاح'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إلغاء الحجز' },
      { status: 500 }
    );
  }
} 