import { Metadata } from 'next';
import Link from 'next/link';
import { getBookingById } from '@/lib/services/bookingService';
import BookingEditForm from '@/components/admin/BookingEditForm';

export const metadata: Metadata = {
  title: 'تعديل الحجز | منال للتجميل',
  description: 'تعديل تفاصيل الحجز',
};

export default async function BookingEditPage({ params }: { params: { id: string } }) {
  const bookingId = params.id;
  
  let booking;
  let error = null;
  
  try {
    booking = await getBookingById(bookingId);
  } catch (err) {
    error = 'فشل في جلب تفاصيل الحجز';
    console.error('Error fetching booking:', err);
  }
  
  if (error) {
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
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
  
  if (!booking) {
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            الحجز غير موجود
          </div>
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
            <BookingEditForm booking={booking} />
          </div>
        </div>
      </div>
    </main>
  );
} 