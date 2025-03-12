import { Metadata } from 'next';
import ClientTreatmentPlans from '@/components/client/ClientTreatmentPlans';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'خطط العلاج | منال بيوتي',
  description: 'عرض خطط العلاج الخاصة بك ومتابعة تقدمها',
};

export default function ClientTreatmentsPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-600">خطط العلاج</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ClientTreatmentPlans />
        </div>
      </div>
    </ClientLayout>
  );
} 