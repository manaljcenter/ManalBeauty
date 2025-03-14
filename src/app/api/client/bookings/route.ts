import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Get client bookings
export async function GET(request: NextRequest) {
  try {
    // Get client session
    const clientSessionCookie = request.cookies.get('client_session')?.value;
    
    if (!clientSessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح به' },
        { status: 401 }
      );
    }
    
    // Parse client session
    const clientSession = JSON.parse(clientSessionCookie);
    const clientId = clientSession.id;
    
    // Get bookings from Supabase
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (*)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching client bookings:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب الحجوزات' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/client/bookings:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// Create a new booking
export async function POST(request: NextRequest) {
  try {
    // Get client session
    const clientSessionCookie = request.cookies.get('client_session')?.value;
    
    if (!clientSessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح به' },
        { status: 401 }
      );
    }
    
    // Parse client session
    const clientSession = JSON.parse(clientSessionCookie);
    const clientId = clientSession.id;
    const clientName = clientSession.name;
    
    // Get client details
    const supabase = createClient();
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('email, phone')
      .eq('id', clientId)
      .single();
    
    if (clientError) {
      console.error('Error fetching client details:', clientError);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب بيانات العميل' },
        { status: 500 }
      );
    }
    
    // Get booking data from request
    const body = await request.json();
    const { service_id, date, time, notes, discount_code, final_price } = body;
    
    // Validate required fields
    if (!service_id || !date || !time) {
      return NextResponse.json(
        { message: 'جميع الحقول المطلوبة غير متوفرة' },
        { status: 400 }
      );
    }
    
    // Get service details to calculate price if final_price is not provided
    let bookingPrice = 0;
    
    if (final_price !== undefined) {
      bookingPrice = final_price;
    } else {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('price')
        .eq('id', service_id)
        .single();
      
      if (serviceError) {
        console.error('Error fetching service details:', serviceError);
        return NextResponse.json(
          { message: 'حدث خطأ أثناء جلب بيانات الخدمة' },
          { status: 500 }
        );
      }
      
      bookingPrice = serviceData.price;
    }
    
    // Create booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        client_id: clientId,
        client_name: clientName,
        client_email: clientData.email,
        client_phone: clientData.phone,
        service_id,
        date,
        time,
        notes,
        status: 'pending',
        discount_code: discount_code || null,
        price: bookingPrice
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء إنشاء الحجز' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'تم إنشاء الحجز بنجاح',
      booking: bookingData
    });
  } catch (error) {
    console.error('Error in POST /api/client/bookings:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
} 