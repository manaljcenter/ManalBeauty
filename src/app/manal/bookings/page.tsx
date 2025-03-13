import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBookings } from '@/lib/services/bookingService';

export const metadata: Metadata = {
  title: 'إدارة الحجوزات | منال للتجميل',
  description: 'إدارة حجوزات مركز منال للتجميل',
};

async function getBookings() {
  try {
    const bookings = await getAllBookings();
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export default async function BookingsManalPage() {
  const bookings = await getBookings();
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">إدارة الحجوزات</h1>
          <div className="flex gap-4">
            <Link 
              href="/manal/bookings?status=pending" 
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              الحجوزات المعلقة
            </Link>
            <Link 
              href="/manal/bookings?status=confirmed" 
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              الحجوزات المؤكدة
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الخدمة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوقت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.client_name}</div>
                        <div className="text-sm text-gray-500">{booking.client_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.services?.name}</div>
                        <div className="text-sm text-gray-500">{booking.services?.price} د.ل</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString('ar-LY')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status === 'confirmed' ? 'مؤكد' : 
                           booking.status === 'cancelled' ? 'ملغي' : 
                           booking.status === 'completed' ? 'مكتمل' : 'معلق'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/manal/bookings/${booking.id}`}
                          className="text-primary hover:text-primary-dark ml-4"
                        >
                          عرض
                        </Link>
                        <Link 
                          href={`/manal/bookings/${booking.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          تعديل
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد حجوزات حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 