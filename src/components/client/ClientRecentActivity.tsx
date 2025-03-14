'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarCheck, FaClipboardList, FaFileAlt } from 'react-icons/fa';

interface Activity {
  id: string;
  type: 'booking' | 'treatment' | 'report';
  title: string;
  description: string;
  date: string;
  link: string;
}

export default function ClientRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch bookings
        const bookingsResponse = await fetch('/api/client/bookings');
        if (!bookingsResponse.ok) {
          throw new Error('فشل في جلب الحجوزات');
        }
        const bookingsData = await bookingsResponse.json();
        
        // Fetch treatment plans
        const treatmentsResponse = await fetch('/api/client/treatment-plans');
        if (!treatmentsResponse.ok) {
          throw new Error('فشل في جلب خطط العلاج');
        }
        const treatmentsData = await treatmentsResponse.json();
        
        // Create activities array
        const allActivities: Activity[] = [];
        
        // Add bookings to activities
        bookingsData.forEach((booking: any) => {
          allActivities.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            title: 'حجز موعد',
            description: `تم حجز موعد للخدمة: ${booking.services?.name || 'غير محدد'}`,
            date: booking.created_at,
            link: `/client/bookings/${booking.id}`
          });
        });
        
        // Add treatment plans to activities
        treatmentsData.treatmentPlans?.forEach((plan: any) => {
          allActivities.push({
            id: `treatment-${plan.id}`,
            type: 'treatment',
            title: 'خطة علاج',
            description: `تم إنشاء خطة علاج جديدة (${plan.completed_sessions}/${plan.total_sessions} جلسة)`,
            date: plan.created_at,
            link: `/client/treatments/${plan.id}`
          });
        });
        
        // Sort activities by date (descending)
        allActivities.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        // Get only the 5 most recent activities
        setActivities(allActivities.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError('حدث خطأ أثناء تحميل النشاطات الأخيرة');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, []);
  
  // Format date to Arabic format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'اليوم';
    } else if (diffDays === 1) {
      return 'الأمس';
    } else if (diffDays < 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('ar-SA', options);
    }
  };
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <FaCalendarCheck className="text-pink-500" />;
      case 'treatment':
        return <FaClipboardList className="text-blue-500" />;
      case 'report':
        return <FaFileAlt className="text-green-500" />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">جاري تحميل النشاطات...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
        {error}
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">لا توجد أنشطة حديثة</p>
        <p className="text-gray-600 mt-2">قم بحجز موعد جديد أو استعرض خطط العلاج الخاصة بك</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b pb-4 last:border-b-0">
          <div className="flex items-start">
            <div className="mt-1 ml-3">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <Link href={activity.link} className="text-xs text-pink-600 hover:text-pink-800 mt-1 inline-block">
                عرض التفاصيل
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <Link href="/client/bookings" className="text-sm text-pink-600 hover:text-pink-800">
          عرض كل النشاطات
        </Link>
      </div>
    </div>
  );
} 