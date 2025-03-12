import { Metadata } from 'next';
import Link from 'next/link';
import { getServiceById } from '@/lib/services/serviceService';

export const metadata: Metadata = {
  title: 'تفاصيل الخدمة | منال للتجميل',
  description: 'عرض تفاصيل الخدمة',
};

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
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
  
  // Helper function to get category name in Arabic
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'facial': return 'العناية بالوجه';
      case 'hair_removal': return 'إزالة الشعر';
      case 'skin_treatment': return 'علاج البشرة';
      case 'massage': return 'المساج';
      default: return 'أخرى';
    }
  };
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">تفاصيل الخدمة</h1>
          <div className="flex gap-4">
            <Link 
              href={`/admin/services/${service.id}/edit`} 
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              تعديل الخدمة
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
            <div className="flex flex-col md:flex-row gap-8">
              {service.image && (
                <div className="w-full md:w-1/3">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
              
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{service.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">الفئة</p>
                    <p className="font-medium">{getCategoryName(service.category)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">السعر</p>
                    <p className="font-medium">{service.price} د.ل</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">المدة</p>
                    <p className="font-medium">{service.duration} دقيقة</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">تاريخ الإضافة</p>
                    <p className="font-medium">
                      {new Date(service.created_at).toLocaleDateString('ar-LY')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">الوصف</p>
                  <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 