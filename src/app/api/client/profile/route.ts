import { NextRequest, NextResponse } from 'next/server';
import { getClientById, updateClient } from '@/lib/services/clientService';

export async function GET(request: NextRequest) {
  try {
    // Get client ID from session cookie
    const clientSession = request.cookies.get('client_session')?.value;
    
    if (!clientSession) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(clientSession);
    const clientId = session.id;
    
    // Get client profile
    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { message: 'لم يتم العثور على الملف الشخصي' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(client);
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
    const sessionCookie = request.cookies.get('client_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(sessionCookie);
    const clientId = session.id;
    
    // Get update data
    const body = await request.json();
    const { name, email, phone } = body;
    
    // Update client
    const updatedClient = await updateClient(clientId, {
      name,
      email,
      phone
    });
    
    if (!updatedClient) {
      return NextResponse.json(
        { message: 'فشل تحديث الملف الشخصي' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      client: updatedClient
    });
  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
} 