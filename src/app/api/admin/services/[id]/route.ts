import { NextRequest, NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/services/serviceService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    
    // Get service details
    const service = await getServiceById(serviceId);
    
    if (!service) {
      return NextResponse.json(
        { message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب تفاصيل الخدمة' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'duration', 'category'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
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
    
    // Check if service exists
    const existingService = await getServiceById(serviceId);
    if (!existingService) {
      return NextResponse.json(
        { message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }
    
    // Update service
    const serviceData = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      duration: Number(body.duration),
      category: body.category,
      image: body.image || null
    };
    
    const updatedService = await updateService(serviceId, serviceData);
    
    return NextResponse.json({
      message: 'تم تحديث الخدمة بنجاح',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الخدمة' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    
    // Check if service exists
    const existingService = await getServiceById(serviceId);
    if (!existingService) {
      return NextResponse.json(
        { message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }
    
    // Delete service
    await deleteService(serviceId);
    
    return NextResponse.json({
      message: 'تم حذف الخدمة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الخدمة' },
      { status: 500 }
    );
  }
} 