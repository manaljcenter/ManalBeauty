import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBookings } from '@/lib/services/bookingService';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'لوحة التحكم | منال للتجميل',
  description: 'لوحة تحكم مركز منال للتجميل',
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

export default async function AdminDashboard() {
  const recentBookings = await getBookings();
  
  return (
    <main className="container mx-auto py-12 px-4">
      <AdminDashboardClient />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">لوحة التحكم</h1>
          <div className="flex gap-4">
            <Link 
              href="/admin/services" 
              className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors"
            >
              إدارة الخدمات
            </Link>
            <Link 
              href="/admin/bookings" 
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              جميع الحجوزات
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">الحجوزات اليوم</h3>
            <p className="text-3xl font-bold text-primary">
              {recentBookings.filter(booking => 
                new Date(booking.date).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">الحجوزات المعلقة</h3>
            <p className="text-3xl font-bold text-amber-500">
              {recentBookings.filter(booking => booking.status === 'pending').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">الحجوزات المؤكدة</h3>
            <p className="text-3xl font-bold text-green-500">
              {recentBookings.filter(booking => booking.status === 'confirmed').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">أحدث الحجوزات</h2>
          </div>
          
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
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
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
                          href={`/admin/bookings/${booking.id}`}
                          className="text-primary hover:text-primary-dark ml-4"
                        >
                          عرض
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
          
          <div className="p-4 border-t">
            <Link 
              href="/admin/bookings" 
              className="text-primary hover:text-primary-dark font-medium"
            >
              عرض جميع الحجوزات
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 