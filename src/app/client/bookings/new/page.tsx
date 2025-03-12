import { Metadata } from 'next';
import NewBookingForm from '@/components/client/NewBookingForm';
import ClientLayout from '@/components/layouts/ClientLayout';

export const metadata: Metadata = {
  title: 'حجز موعد جديد | منال بيوتي',
  description: 'حجز موعد جديد في منال بيوتي',
};

export default function NewBookingPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">حجز موعد جديد</h1>
        <div className="max-w-2xl mx-auto">
          <NewBookingForm />
        </div>
      </div>
    </ClientLayout>
  );
} 