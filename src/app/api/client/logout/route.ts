import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'تم تسجيل الخروج بنجاح',
    });

    // Clear session cookie
    response.cookies.set({
      name: 'client_session',
      value: '',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
} 