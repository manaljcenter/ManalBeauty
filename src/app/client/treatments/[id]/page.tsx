import { Metadata } from 'next';
import TreatmentDetails from '@/components/client/TreatmentDetails';
import TreatmentSessionsList from '@/components/client/TreatmentSessionsList';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'تفاصيل خطة العلاج | منال بيوتي',
  description: 'عرض تفاصيل خطة العلاج والجلسات',
};

export default function TreatmentDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-600">تفاصيل خطة العلاج</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <TreatmentDetails treatmentPlanId={params.id} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">جلسات العلاج</h2>
            <TreatmentSessionsList treatmentPlanId={params.id} />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 