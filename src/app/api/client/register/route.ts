import { NextRequest, NextResponse } from 'next/server';
import { createClient, getClientByEmail } from '@/lib/services/clientService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingClient = await getClientByEmail(email);
    if (existingClient) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }
    
    // Create new client
    const client = await createClient({
      name,
      email,
      phone,
      password,
    });
    
    if (!client) {
      return NextResponse.json(
        { message: 'فشل إنشاء الحساب' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      message: 'تم إنشاء الحساب بنجاح',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      }
    });
  } catch (error) {
    console.error('Error during client registration:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
} 