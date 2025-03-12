'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Report {
  id: string;
  treatment_session_id: string;
  report_text: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  session?: {
    id: string;
    treatment_plan_id: string;
    session_number: number;
    date: string;
    time: string | null;
  };
}

interface ReportDetailsProps {
  reportId: string;
}

export default function ReportDetails({ reportId }: ReportDetailsProps) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/client/reports/${reportId}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/client/login');
            return;
          }
          throw new Error('Failed to fetch report');
        }
        
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        setError('Failed to load report data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId, router]);

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

  if (!report) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">لم يتم العثور على التقرير</p>
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
      {report.session && (
        <div className="mb-6">
          <Link 
            href={`/client/treatments/${report.session.treatment_plan_id}`}
            className="text-pink-600 hover:text-pink-800"
          >
            &larr; العودة إلى خطة العلاج
          </Link>
          <div className="mt-2">
            <p className="text-gray-500">
              جلسة #{report.session.session_number} - {formatDate(report.session.date)}
              {report.session.time && ` - ${report.session.time}`}
            </p>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-pink-600">تفاصيل التقرير</h2>
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {report.report_text}
        </div>
      </div>
      
      {report.image_url && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-pink-600">صورة الجلسة</h3>
          <div className="relative h-80 w-full md:w-2/3 lg:w-1/2 mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={report.image_url}
              alt="صورة الجلسة"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>تاريخ التقرير: {formatDate(report.created_at)}</p>
        {report.updated_at !== report.created_at && (
          <p>آخر تحديث: {formatDate(report.updated_at)}</p>
        )}
      </div>
    </div>
  );
} 