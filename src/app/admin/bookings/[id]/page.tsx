import { Metadata } from 'next';
import Link from 'next/link';
import { getBookingById } from '@/lib/services/bookingService';
import BookingStatusUpdate from '@/components/admin/BookingStatusUpdate';

export const metadata: Metadata = {
  title: 'تفاصيل الحجز | منال للتجميل',
  description: 'عرض تفاصيل الحجز وإدارته',
};

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
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
  
  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString('ar-LY');
  
  // Get status in Arabic
  const getStatusInArabic = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'confirmed': 'مؤكد',
      'cancelled': 'ملغي',
      'completed': 'مكتمل'
    };
    
    return statusMap[status] || status;
  };
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">تفاصيل الحجز</h1>
          <div className="flex gap-4">
            <Link 
              href="/admin/bookings" 
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              العودة إلى الحجوزات
            </Link>
            <Link 
              href={`/admin/bookings/${booking.id}/edit`} 
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              تعديل الحجز
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium mr-2">{booking.client_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">رقم الهاتف:</span>
                    <span className="font-medium mr-2">{booking.client_phone}</span>
                  </div>
                  {booking.client_email && (
                    <div>
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium mr-2">{booking.client_email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">معلومات الحجز</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">الخدمة:</span>
                    <span className="font-medium mr-2">{booking.services.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-medium mr-2">{booking.services.price} د.ل</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-medium mr-2">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الوقت:</span>
                    <span className="font-medium mr-2">{booking.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mr-2
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {getStatusInArabic(booking.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {booking.notes && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">ملاحظات</h2>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
            
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">تحديث حالة الحجز</h2>
              <BookingStatusUpdate bookingId={booking.id} currentStatus={booking.status} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 