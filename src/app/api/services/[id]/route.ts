import { NextRequest, NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/services/serviceService';

// Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الخدمة غير صالح' },
        { status: 400 }
      );
    }

    const service = await getServiceById(id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب الخدمة', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الخدمة غير صالح' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, duration, category, image } = body;

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'الاسم والسعر والفئة مطلوبة' },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await getServiceById(id);
    
    if (!existingService) {
      return NextResponse.json(
        { success: false, message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    // Update service
    const updatedService = await updateService(id, {
      name,
      description: description || '',
      price,
      duration: duration || 0,
      category,
      image: image || '',
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الخدمة بنجاح',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تحديث الخدمة', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الخدمة غير صالح' },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await getServiceById(id);
    
    if (!existingService) {
      return NextResponse.json(
        { success: false, message: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    // Delete service
    await deleteService(id);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الخدمة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء حذف الخدمة', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 