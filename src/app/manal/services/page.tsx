import { Metadata } from 'next';
import Link from 'next/link';
import { getAllServices } from '@/lib/services/serviceService';

export const metadata: Metadata = {
  title: 'إدارة الخدمات | منال للتجميل',
  description: 'إدارة خدمات مركز منال للتجميل',
};

async function getServices() {
  try {
    const services = await getAllServices();
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServicesManalPage() {
  const services = await getServices();
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">إدارة الخدمات</h1>
          <Link 
            href="/manal/services/new" 
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            إضافة خدمة جديدة
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الخدمة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {service.image && (
                            <div className="flex-shrink-0 h-10 w-10 ml-4">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={service.image} 
                                alt={service.name} 
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {service.category === 'facial' ? 'العناية بالوجه' :
                           service.category === 'hair_removal' ? 'إزالة الشعر' :
                           service.category === 'skin_treatment' ? 'علاج البشرة' :
                           service.category === 'massage' ? 'المساج' : 'أخرى'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.price} د.ل
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration} دقيقة
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/manal/services/${service.id}/edit`}
                          className="text-primary hover:text-primary-dark ml-4"
                        >
                          تعديل
                        </Link>
                        <Link 
                          href={`/manal/services/${service.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد خدمات حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 