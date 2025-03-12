import { Metadata } from 'next';
import Link from 'next/link';
import ClientLayout from '@/components/layouts/ClientLayout';

export const metadata: Metadata = {
  title: 'لوحة التحكم | منال بيوتي',
  description: 'لوحة تحكم العميل لإدارة الحجوزات وخطط العلاج',
};

export default function ClientDashboardPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">لوحة التحكم</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">إجراءات سريعة</h2>
            <div className="space-y-4">
              <Link 
                href="/client/bookings/new" 
                className="block w-full text-center bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
              >
                حجز موعد جديد
              </Link>
              <Link 
                href="/client/bookings" 
                className="block w-full text-center bg-white text-pink-600 border border-pink-600 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors"
              >
                عرض حجوزاتي
              </Link>
              <Link 
                href="/client/treatments" 
                className="block w-full text-center bg-white text-pink-600 border border-pink-600 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors"
              >
                عرض خطط العلاج
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">النشاط الأخير</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-500 text-sm">لا توجد أنشطة حديثة</p>
                <p className="text-gray-600 mt-2">قم بحجز موعد جديد أو استعرض خطط العلاج الخاصة بك</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">المواعيد القادمة</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الخدمة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوقت
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">لا توجد مواعيد قادمة</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href="/client/bookings/new" className="text-pink-600 hover:text-pink-900">
                      حجز موعد
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 