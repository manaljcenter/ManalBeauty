'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Booking } from '@/lib/services/bookingService';

interface BookingsListProps {
  clientId: string;
}

export default function BookingsList({ clientId }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/client/bookings`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('فشل في جلب الحجوزات');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد حجوزات حالية</p>
        <Link href="/booking" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          حجز موعد جديد
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">الحجوزات</h2>
        <Link href="/booking" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">
          حجز موعد جديد
        </Link>
      </div>
      
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{booking.services.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString('ar-SA')} - {booking.time}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">السعر</p>
                  <p className="font-medium">{booking.services.price} ريال</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">المدة</p>
                  <p className="font-medium">{booking.services.duration} دقيقة</p>
                </div>
              </div>
              
              {booking.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">ملاحظات</p>
                  <p className="text-sm mt-1">{booking.notes}</p>
                </div>
              )}
              
              <div className="mt-4">
                <Link 
                  href={`/booking/confirmation/${booking.id}`}
                  className="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  عرض تفاصيل الحجز
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 