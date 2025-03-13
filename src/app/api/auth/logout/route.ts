import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json({ message: 'تم تسجيل الخروج بنجاح' });
    
    // Clear the session cookies
    response.cookies.set('admin_session', '', { maxAge: 0 });
    response.cookies.set('user-info', '', { maxAge: 0 });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
} 