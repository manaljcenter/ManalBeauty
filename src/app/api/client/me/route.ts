import { NextRequest, NextResponse } from 'next/server';
import { getClientById } from '@/lib/services/clientService';

export async function GET(request: NextRequest) {
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
    let session;
    try {
      session = JSON.parse(sessionCookie.value);
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
    
    // Get client by ID
    const client = await getClientById(session.clientId);
    
    if (!client) {
      return NextResponse.json(
        { message: 'العميل غير موجود' },
        { status: 404 }
      );
    }
    
    // Return client data (excluding password)
    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        created_at: client.created_at,
        updated_at: client.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب بيانات العميل' },
      { status: 500 }
    );
  }
} 