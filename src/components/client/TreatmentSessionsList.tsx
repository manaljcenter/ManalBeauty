'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TreatmentSession {
  id: string;
  treatment_plan_id: string;
  session_number: number;
  date: string;
  time: string | null;
  status: string;
  notes: string | null;
  treatment_performed: string | null;
  results: string | null;
  report_id: string | null;
  created_at: string;
}

interface TreatmentSessionsListProps {
  treatmentPlanId: string;
}

export default function TreatmentSessionsList({ treatmentPlanId }: TreatmentSessionsListProps) {
  const [sessions, setSessions] = useState<TreatmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/client/treatment-plans/${treatmentPlanId}/sessions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch treatment sessions');
        }
        
        const data = await response.json();
        setSessions(data.sessions);
      } catch (err) {
        setError('Failed to load treatment sessions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [treatmentPlanId]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'missed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'مجدولة';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      case 'missed':
        return 'فائتة';
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

  if (sessions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">لا توجد جلسات مجدولة بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">الجلسة #{session.session_number}</h3>
              <p className="text-gray-500 text-sm">
                {formatDate(session.date)}
                {session.time && ` - ${session.time}`}
              </p>
            </div>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(session.status)}`}>
              {getStatusText(session.status)}
            </span>
          </div>
          
          {(session.notes || session.treatment_performed || session.results) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {session.notes && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">ملاحظات:</p>
                  <p className="text-sm">{session.notes}</p>
                </div>
              )}
              
              {session.treatment_performed && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">العلاج المقدم:</p>
                  <p className="text-sm">{session.treatment_performed}</p>
                </div>
              )}
              
              {session.results && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">النتائج:</p>
                  <p className="text-sm">{session.results}</p>
                </div>
              )}
            </div>
          )}
          
          {session.report_id && (
            <div className="mt-3 text-right">
              <Link 
                href={`/client/reports/${session.report_id}`}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                عرض التقرير
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 