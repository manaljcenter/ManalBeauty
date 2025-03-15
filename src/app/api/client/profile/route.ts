import { NextRequest, NextResponse } from 'next/server';
import { getClientById, updateClient } from '@/lib/services/clientService';

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
    
    let session;
    try {
      session = JSON.parse(clientSession);
    } catch (error) {
      console.error('Error parsing session cookie:', error);
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    // Check if clientId exists in session
    if (!session || !session.clientId) {
      console.error('Invalid session structure:', session);
      return NextResponse.json(
        { message: 'بنية الجلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    const clientId = session.clientId;
    
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
    const sessionCookie = request.cookies.get('client-session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }
    
    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch (error) {
      console.error('Error parsing session cookie:', error);
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    // Check if clientId exists in session
    if (!session || !session.clientId) {
      console.error('Invalid session structure:', session);
      return NextResponse.json(
        { message: 'بنية الجلسة غير صالحة' },
        { status: 401 }
      );
    }
    
    const clientId = session.clientId;
    
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