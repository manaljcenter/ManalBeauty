import { Metadata } from 'next';
import Link from 'next/link';
import { getBookingById } from '@/lib/services/bookingService';
import BookingEditForm from '@/components/admin/BookingEditForm';
import { getServices } from '@/lib/services/serviceService';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'تعديل الحجز | منال للتجميل',
  description: 'تعديل تفاصيل الحجز',
};

interface PageParams {
  params: {
    id: string;
  };
}

export default async function EditBookingPage({ params }: PageParams) {
  const { id } = params;
  
  try {
    const booking = await getBookingById(id);
    
    if (!booking) {
      notFound();
    }
    
    const services = await getServices();
    
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">تعديل الحجز</h1>
            <div className="flex gap-4">
              <Link 
                href={`/admin/bookings/${booking.id}`} 
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                العودة إلى التفاصيل
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <BookingEditForm booking={booking} services={services} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading booking:', error);
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">خطأ</h1>
          <p className="text-red-500">حدث خطأ أثناء تحميل بيانات الحجز</p>
          <Link 
            href="/admin/bookings" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            العودة إلى الحجوزات
          </Link>
        </div>
      </main>
    );
  }
} 