import { Metadata } from 'next';
import Link from 'next/link';
import ClientBookingsList from '@/components/client/ClientBookingsList';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'الحجوزات | منال بيوتي',
  description: 'إدارة حجوزاتك وعرض تفاصيلها',
};

export default function ClientBookingsPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-700">الحجوزات</h1>
          <Link 
            href="/client/bookings/new" 
            className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            حجز موعد جديد
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ClientBookingsList />
        </div>
      </div>
    </ClientLayout>
  );
} 