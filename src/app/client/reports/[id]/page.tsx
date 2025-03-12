import { Metadata } from 'next';
import ReportDetails from '@/components/client/ReportDetails';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'تقرير الجلسة | منال بيوتي',
  description: 'عرض تقرير جلسة العلاج',
};

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-600">تقرير الجلسة</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ReportDetails reportId={params.id} />
        </div>
      </div>
    </ClientLayout>
  );
} 