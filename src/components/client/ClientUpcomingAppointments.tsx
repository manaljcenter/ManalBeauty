'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Booking {
  id: string;
  client_id: string;
  service_id: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  created_at: string;
  services: Service;
}

export default function ClientUpcomingAppointments() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        const response = await fetch('/api/client/bookings');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/client/login';
            return;
          }
          
          throw new Error('فشل في جلب المواعيد');
        }
        
        const data = await response.json();
        
        // Filter only upcoming and confirmed bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingBookings = data.filter((booking: Booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && (booking.status === 'confirmed' || booking.status === 'pending');
        });
        
        // Sort by date (ascending)
        upcomingBookings.sort((a: Booking, b: Booking) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setBookings(upcomingBookings);
      } catch (err) {
        console.error('Error fetching upcoming bookings:', err);
        setError('حدث خطأ أثناء تحميل المواعيد');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingBookings();
  }, []);
  
  // Format date to Arabic format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };
  
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
  
  // Get status color
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };
  
  if (loading) {
    return <div className="text-center py-4">جاري تحميل المواعيد...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
        {error}
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">لا توجد مواعيد قادمة</p>
        <Link 
          href="/client/bookings/new" 
          className="inline-block bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
        >
          حجز موعد جديد
        </Link>
      </div>
    );
  }
  
  return (
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
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-medium text-gray-900">{booking.services.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-900">{booking.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {getStatusInArabic(booking.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/client/bookings/${booking.id}`} className="text-pink-600 hover:text-pink-900">
                  عرض التفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 