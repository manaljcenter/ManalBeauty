import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, createService } from '@/lib/services/serviceService';

export async function GET() {
  try {
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الخدمات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'duration', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `الحقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }
    
    // Validate category
    const validCategories = ['facial', 'hair_removal', 'skin_treatment', 'massage', 'other'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { message: 'فئة الخدمة غير صالحة' },
        { status: 400 }
      );
    }
    
    // Create service
    const serviceData = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      duration: Number(body.duration),
      category: body.category,
      image: body.image || null
    };
    
    const newService = await createService(serviceData);
    
    return NextResponse.json({
      message: 'تم إنشاء الخدمة بنجاح',
      service: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الخدمة' },
      { status: 500 }
    );
  }
} 