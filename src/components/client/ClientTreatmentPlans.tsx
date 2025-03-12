'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TreatmentPlan {
  id: string;
  total_sessions: number;
  completed_sessions: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function ClientTreatmentPlans() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTreatmentPlans = async () => {
      try {
        const response = await fetch('/api/client/treatment-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch treatment plans');
        }
        
        const data = await response.json();
        setTreatmentPlans(data.treatmentPlans);
      } catch (err) {
        setError('Failed to load treatment plans');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreatmentPlans();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (treatmentPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">لا توجد خطط علاج حالية</p>
        <Link 
          href="/client/bookings/new" 
          className="inline-block px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          حجز موعد جديد
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {treatmentPlans.map((plan) => (
        <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(plan.status)}`}>
                {getStatusText(plan.status)}
              </span>
              <span className="text-gray-500 text-sm mr-2">
                تاريخ البدء: {formatDate(plan.created_at)}
              </span>
            </div>
            <Link 
              href={`/client/treatments/${plan.id}`}
              className="text-sm text-pink-600 hover:text-pink-800"
            >
              عرض التفاصيل
            </Link>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">تقدم الجلسات</span>
              <span className="text-sm text-gray-500">
                {plan.completed_sessions} من {plan.total_sessions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-pink-600 h-2.5 rounded-full" 
                style={{ width: `${(plan.completed_sessions / plan.total_sessions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {plan.notes && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium">ملاحظات:</p>
              <p>{plan.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 