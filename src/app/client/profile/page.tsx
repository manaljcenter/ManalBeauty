import { Metadata } from 'next';
import ClientProfileDetails from '@/components/client/ClientProfileDetails';
import ClientTreatmentPlans from '@/components/client/ClientTreatmentPlans';
import ClientBookingsList from '@/components/client/ClientBookingsList';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'الملف الشخصي | منال بيوتي',
  description: 'إدارة ملفك الشخصي وعرض خطط العلاج والحجوزات',
};

export default function ClientProfilePage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">الملف الشخصي</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <ClientProfileDetails />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-pink-600">خطط العلاج</h2>
              <ClientTreatmentPlans />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-pink-600">الحجوزات</h2>
              <ClientBookingsList />
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 