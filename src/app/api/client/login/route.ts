import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient } from '@/lib/services/clientService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }
    
    // Authenticate client
    const client = await authenticateClient(email, password);
    
    if (!client) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    // Create response with session data
    const response = NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      }
    });
    
    // Set session cookie in the response
    response.cookies.set({
      name: 'client-session',
      value: JSON.stringify({
        clientId: client.id,
        email: client.email,
        name: client.name
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error during client login:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
} 