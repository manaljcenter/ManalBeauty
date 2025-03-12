'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TreatmentPlan {
  id: string;
  total_sessions: number;
  completed_sessions: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TreatmentDetailsProps {
  treatmentPlanId: string;
}

export default function TreatmentDetails({ treatmentPlanId }: TreatmentDetailsProps) {
  const router = useRouter();
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTreatmentPlan = async () => {
      try {
        const response = await fetch(`/api/client/treatment-plans/${treatmentPlanId}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/client/login');
            return;
          }
          throw new Error('Failed to fetch treatment plan');
        }
        
        const data = await response.json();
        setTreatmentPlan(data.treatmentPlan);
      } catch (err) {
        setError('Failed to load treatment plan data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreatmentPlan();
  }, [treatmentPlanId, router]);

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

  if (!treatmentPlan) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">لم يتم العثور على خطة العلاج</p>
        <Link 
          href="/client/profile" 
          className="text-pink-600 hover:text-pink-800"
        >
          العودة إلى الملف الشخصي
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-pink-600">معلومات الخطة</h2>
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(treatmentPlan.status)}`}>
          {getStatusText(treatmentPlan.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">رقم الخطة</p>
          <p className="font-medium">#{treatmentPlan.id.substring(0, 8).toUpperCase()}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">تاريخ البدء</p>
          <p className="font-medium">{formatDate(treatmentPlan.created_at)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">عدد الجلسات</p>
          <p className="font-medium">{treatmentPlan.total_sessions}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">الجلسات المكتملة</p>
          <p className="font-medium">{treatmentPlan.completed_sessions}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">تقدم الخطة</span>
          <span className="text-sm text-gray-500">
            {treatmentPlan.completed_sessions} من {treatmentPlan.total_sessions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-pink-600 h-2.5 rounded-full" 
            style={{ width: `${(treatmentPlan.completed_sessions / treatmentPlan.total_sessions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {treatmentPlan.notes && (
        <div>
          <p className="text-sm text-gray-500 mb-1">ملاحظات</p>
          <p className="p-3 bg-gray-50 rounded-md">{treatmentPlan.notes}</p>
        </div>
      )}
    </div>
  );
} 