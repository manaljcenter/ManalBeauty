import { NextRequest, NextResponse } from 'next/server';
import { getClientById, updateClient } from '@/lib/services/clientService';
import { verifyPassword } from '@/lib/services/authService';

export async function GET(request: NextRequest) {
  try {
    // Get client ID from session cookie
    const clientSession = request.cookies.get('client-session')?.value;
    
    if (!clientSession) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(clientSession);
    const clientId = session.clientId;
    
    if (!clientId) {
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    // Get client profile
    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { message: 'لم يتم العثور على الملف الشخصي' },
        { status: 404 }
      );
    }
    
    // Remove sensitive information
    const { password, ...clientProfile } = client;
    
    return NextResponse.json(clientProfile);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب الملف الشخصي' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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
    
    // Get request body
    const body = await request.json();
    const { name, phone, password } = body;
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { message: 'الاسم ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }
    
    // Update client
    const updatedClient = await updateClient(session.clientId, {
      name,
      phone,
      password: password || undefined
    });
    
    if (!updatedClient) {
      return NextResponse.json(
        { message: 'فشل تحديث الملف الشخصي' },
        { status: 500 }
      );
    }
    
    // Return updated client data
    return NextResponse.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      client: {
        id: updatedClient.id,
        name: updatedClient.name,
        email: updatedClient.email,
        phone: updatedClient.phone,
        created_at: updatedClient.created_at,
        updated_at: updatedClient.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
} 