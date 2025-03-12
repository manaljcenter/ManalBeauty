import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceById } from '@/lib/services/serviceService';
import ServiceEditForm from '@/components/admin/ServiceEditForm';

export const metadata: Metadata = {
  title: 'تعديل الخدمة | منال للتجميل',
  description: 'تعديل تفاصيل الخدمة',
};

export default async function ServiceEditPage({ params }: { params: { id: string } }) {
  const serviceId = params.id;
  
  let service;
  let error = null;
  
  try {
    service = await getServiceById(serviceId);
  } catch (err) {
    error = 'فشل في جلب تفاصيل الخدمة';
    console.error('Error fetching service:', err);
  }
  
  if (error) {
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link 
            href="/admin/services" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            العودة إلى الخدمات
          </Link>
        </div>
      </main>
    );
  }
  
  if (!service) {
    return (
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            الخدمة غير موجودة
          </div>
          <Link 
            href="/admin/services" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            العودة إلى الخدمات
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">تعديل الخدمة</h1>
          <div className="flex gap-4">
            <Link 
              href={`/admin/services/${service.id}`} 
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              العودة إلى التفاصيل
            </Link>
            <Link 
              href="/admin/services" 
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              العودة إلى الخدمات
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <ServiceEditForm service={service} />
          </div>
        </div>
      </div>
    </main>
  );
} 