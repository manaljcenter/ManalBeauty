import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';

export async function GET() {
  try {
    // Test query to check database connection
    const allServices = await db.select().from(services).limit(5);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: allServices
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 