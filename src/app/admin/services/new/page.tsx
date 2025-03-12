import { Metadata } from 'next';
import Link from 'next/link';
import ServiceCreateForm from '@/components/admin/ServiceCreateForm';

export const metadata: Metadata = {
  title: 'إضافة خدمة جديدة | منال للتجميل',
  description: 'إضافة خدمة جديدة إلى مركز منال للتجميل',
};

export default function ServiceCreatePage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">إضافة خدمة جديدة</h1>
          <Link 
            href="/admin/services" 
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            العودة إلى الخدمات
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <ServiceCreateForm />
          </div>
        </div>
      </div>
    </main>
  );
} 