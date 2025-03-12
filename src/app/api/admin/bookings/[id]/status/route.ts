import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus } from '@/lib/services/bookingService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    const { status } = body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'حالة الحجز غير صالحة' },
        { status: 400 }
      );
    }
    
    // Update booking status
    const updatedBooking = await updateBookingStatus(bookingId, status);
    
    return NextResponse.json({
      message: 'تم تحديث حالة الحجز بنجاح',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث حالة الحجز' },
      { status: 500 }
    );
  }
} 