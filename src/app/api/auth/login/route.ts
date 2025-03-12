import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.log('User not found with email:', email);
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    console.log('User found:', { id: user.id, email: user.email, role: user.role });
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('Password verification result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Create a session object
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.log('Creating session for user:', session.email);

    // Create response
    const response = NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set session cookie
    response.cookies.set({
      name: 'session',
      value: JSON.stringify(session),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set user info cookie for client access
    response.cookies.set({
      name: 'user-info',
      value: JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    console.log('Login successful for user:', session.email);
    console.log('Cookies set:', response.cookies.getAll());
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
} 