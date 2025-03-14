'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaDownload, FaEye } from 'react-icons/fa';

interface Report {
  id: string;
  client_id: string;
  treatment_session_id: string;
  title: string;
  content: string;
  file_url: string | null;
  created_at: string;
  treatment_sessions: {
    id: string;
    treatment_plan_id: string;
    session_number: number;
    treatment_plans: {
      id: string;
      name: string;
    }
  }
}

export default function ClientReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/client/reports');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/client/login';
            return;
          }
          
          throw new Error('فشل في جلب التقارير');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('حدث خطأ أثناء تحميل التقارير');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
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
  
  if (loading) {
    return <div className="text-center py-8">جاري تحميل التقارير...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
        {error}
      </div>
    );
  }
  
  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">لا توجد تقارير حالية</p>
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
    <div className="space-y-6">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <FaFileAlt className="text-pink-500 text-xl ml-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">
                  {report.treatment_sessions?.treatment_plans?.name} - الجلسة {report.treatment_sessions?.session_number}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{formatDate(report.created_at)}</span>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-line">{report.content}</p>
          </div>
          
          <div className="flex justify-end space-x-reverse space-x-3">
            <Link 
              href={`/client/reports/${report.id}`} 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FaEye className="ml-1" />
              عرض التفاصيل
            </Link>
            
            {report.file_url && (
              <a 
                href={report.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
              >
                <FaDownload className="ml-1" />
                تحميل المرفق
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 