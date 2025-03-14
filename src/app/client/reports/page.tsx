import { Metadata } from 'next';
import { Suspense } from 'react';
import ClientLayout from '@/components/layouts/ClientLayout';
import ClientReports from '@/components/client/ClientReports';

export const metadata: Metadata = {
  title: 'التقارير | منال بيوتي',
  description: 'عرض تقارير الجلسات والتشخيصات الخاصة بك',
};

// Loading fallback component
function ReportsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default function ClientReportsPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-700">التقارير</h1>
          <p className="text-gray-600 mt-2">
            عرض تقارير الجلسات والتشخيصات الخاصة بك
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Suspense fallback={<ReportsLoading />}>
            <ClientReports />
          </Suspense>
        </div>
      </div>
    </ClientLayout>
  );
} 