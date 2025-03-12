'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreatmentPlan } from '@/lib/services/treatmentService';

interface TreatmentPlansListProps {
  clientId: string;
}

export default function TreatmentPlansList({ clientId }: TreatmentPlansListProps) {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTreatmentPlans = async () => {
      try {
        const response = await fetch('/api/client/treatments', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('فشل في جلب خطط العلاج');
        }

        const data = await response.json();
        setTreatmentPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentPlans();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
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

  if (treatmentPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد خطط علاج حالية</p>
        <Link href="/booking" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          حجز موعد جديد
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">خطط العلاج</h2>
      
      <div className="space-y-6">
        {treatmentPlans.map((plan) => (
          <div key={plan.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-medium">خطة علاج #{plan.id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  تاريخ البدء: {new Date(plan.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(plan.status)}`}>
                {getStatusText(plan.status)}
              </span>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">عدد الجلسات</p>
                  <p className="font-medium">{plan.total_sessions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الجلسات المكتملة</p>
                  <p className="font-medium">{plan.completed_sessions}</p>
                </div>
              </div>
              
              {plan.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">ملاحظات</p>
                  <p className="text-sm mt-1">{plan.notes}</p>
                </div>
              )}
              
              <div className="mt-4">
                <Link 
                  href={`/client/treatments/${plan.id}`}
                  className="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  عرض تفاصيل الخطة والجلسات
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 