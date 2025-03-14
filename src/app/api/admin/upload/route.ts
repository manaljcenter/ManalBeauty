import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { message: 'خطأ في تكوين الخادم. يرجى الاتصال بمسؤول النظام.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'لم يتم تحميل أي ملف' },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'نوع الملف غير مدعوم. يرجى تحميل صورة بصيغة JPEG أو PNG أو WebP' },
        { status: 400 }
      );
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    console.log(`Uploading file: ${fileName}, type: ${file.type}, size: ${file.size} bytes`);
    
    // Upload to Supabase Storage
    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from('services')
        .upload(`images/${fileName}`, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading file to Supabase storage:', error);
        return NextResponse.json(
          { message: `فشل في رفع الملف: ${error.message}` },
          { status: 500 }
        );
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('services')
        .getPublicUrl(`images/${fileName}`);
      
      console.log(`File uploaded successfully. Public URL: ${publicUrlData.publicUrl}`);
      
      return NextResponse.json({
        message: 'تم رفع الملف بنجاح',
        url: publicUrlData.publicUrl
      });
    } catch (storageError) {
      console.error('Unexpected error during Supabase storage operation:', storageError);
      return NextResponse.json(
        { message: 'حدث خطأ غير متوقع أثناء تخزين الملف' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الصورة' },
      { status: 500 }
    );
  }
} 