import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the admin session cookie
    const adminSession = request.cookies.get('admin_session');
    
    // If no session exists, return unauthorized
    if (!adminSession) {
      return NextResponse.json(
        { message: 'غير مصرح به' },
        { status: 401 }
      );
    }
    
    // Parse the session
    try {
      const session = JSON.parse(adminSession.value);
      
      // Check if the session has the required fields
      if (!session.id || !session.email || !session.role) {
        return NextResponse.json(
          { message: 'جلسة غير صالحة' },
          { status: 401 }
        );
      }
      
      // Check if the user has admin role
      if (session.role !== 'admin') {
        return NextResponse.json(
          { message: 'غير مصرح به' },
          { status: 403 }
        );
      }
      
      // Session is valid
      return NextResponse.json({
        message: 'جلسة صالحة',
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        },
      });
    } catch (error) {
      // Invalid session format
      return NextResponse.json(
        { message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء التحقق من الجلسة' },
      { status: 500 }
    );
  }
} 