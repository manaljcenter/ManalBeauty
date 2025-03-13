import { NextRequest, NextResponse } from 'next/server';
import { createService } from '@/lib/services/serviceService';
import { createClient } from '@/lib/supabase/server';

// Get all services
export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء جلب الخدمات' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/services:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, duration, category, image } = body;

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'الاسم والسعر والفئة مطلوبة' },
        { status: 400 }
      );
    }

    // Create service
    const newService = await createService({
      name,
      description: description || '',
      price,
      duration: duration || 0,
      category,
      image: image || '',
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الخدمة بنجاح',
      service: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إنشاء الخدمة', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 