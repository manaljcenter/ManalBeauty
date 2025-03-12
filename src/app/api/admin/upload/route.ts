import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
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
    
    // Upload to Supabase Storage
    const supabase = createClient();
    const { data, error } = await supabase
      .storage
      .from('services')
      .upload(`images/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { message: 'فشل في تحميل الصورة' },
        { status: 500 }
      );
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('services')
      .getPublicUrl(`images/${fileName}`);
    
    return NextResponse.json({
      message: 'تم تحميل الصورة بنجاح',
      url: publicUrl
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الصورة' },
      { status: 500 }
    );
  }
} 