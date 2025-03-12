import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Sign out from Supabase
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Create response
    const response = NextResponse.json({
      message: 'تم تسجيل الخروج بنجاح'
    });
    
    // Clear session cookie
    response.cookies.set({
      name: 'client_session',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response;
  } catch (error) {
    console.error('Error during client logout:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
} 