import { Metadata } from 'next';
import Link from 'next/link';
import ClientLayout from '@/components/layouts/ClientLayout';
import ClientUpcomingAppointments from '@/components/client/ClientUpcomingAppointments';
import ClientRecentActivity from '@/components/client/ClientRecentActivity';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'لوحة التحكم | منال بيوتي',
  description: 'لوحة تحكم العميل لإدارة الحجوزات وخطط العلاج والتقارير',
};

// Loading fallback components
function AppointmentsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

function ActivityLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}

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
                خطط العلاج
              </Link>
              <Link 
                href="/client/reports" 
                className="block w-full text-center bg-white text-pink-600 border border-pink-600 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors"
              >
                التقارير
              </Link>
              <Link 
                href="/client/profile" 
                className="block w-full text-center bg-white text-pink-600 border border-pink-600 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors"
              >
                الملف الشخصي
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">النشاط الأخير</h2>
            <Suspense fallback={<ActivityLoading />}>
              <ClientRecentActivity />
            </Suspense>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">المواعيد القادمة</h2>
          <Suspense fallback={<AppointmentsLoading />}>
            <ClientUpcomingAppointments />
          </Suspense>
        </div>
      </div>
    </ClientLayout>
  );
} 