import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get the client session cookie
    const clientSession = request.cookies.get('client_session');
    
    // If no session exists, return unauthorized
    if (!clientSession) {
      return NextResponse.json(
        { message: 'يرجى تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    
    // Parse the session
    const session = JSON.parse(clientSession.value);
    
    // Get request body
    const body = await request.json();
    const { code, service_id } = body;
    
    // Validate required fields
    if (!code || !service_id) {
      return NextResponse.json(
        { message: 'يرجى توفير كود الخصم ومعرف الخدمة' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Get the service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single();
    
    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json(
        { message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }
    
    // Check if the discount code exists and is valid
    const { data: discount, error: discountError } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_to', new Date().toISOString())
      .single();
    
    if (discountError || !discount) {
      console.error('Error fetching discount code:', discountError);
      return NextResponse.json(
        { message: 'كود الخصم غير صالح أو منتهي الصلاحية' },
        { status: 404 }
      );
    }
    
    // Check if the discount code is applicable to this service
    if (discount.service_id && discount.service_id !== service_id) {
      return NextResponse.json(
        { message: 'كود الخصم غير صالح لهذه الخدمة' },
        { status: 400 }
      );
    }
    
    // Check if the client has already used this discount code
    const { data: usedDiscount, error: usedDiscountError } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', session.id)
      .eq('discount_code', code.toUpperCase())
      .limit(1);
    
    if (usedDiscount && usedDiscount.length > 0) {
      return NextResponse.json(
        { message: 'لقد استخدمت هذا الكود من قبل' },
        { status: 400 }
      );
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    
    if (discount.discount_type === 'percentage') {
      discountAmount = (service.price * discount.discount_value) / 100;
    } else {
      discountAmount = discount.discount_value;
    }
    
    // Ensure discount doesn't exceed the service price
    discountAmount = Math.min(discountAmount, service.price);
    
    // Return the discount information
    return NextResponse.json({
      message: 'تم تطبيق الخصم بنجاح',
      discount_amount: discountAmount,
      original_price: service.price,
      final_price: service.price - discountAmount
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تطبيق الخصم' },
      { status: 500 }
    );
  }
} 