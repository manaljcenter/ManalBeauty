import { Metadata } from 'next';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import { getAllServices } from '@/lib/services/serviceService';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'حجز موعد | منال للتجميل',
  description: 'احجزي موعدك الآن في مركز منال للتجميل للحصول على أفضل خدمات العناية بالبشرة والشعر',
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

export default async function BookingPage() {
  const servicesList = await getServices();
  
  return (
    <main className="container mx-auto py-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">احجزي موعدك</h1>
          <p className="text-gray-600">
            يمكنك حجز موعد للحصول على خدماتنا المميزة. سنتواصل معك لتأكيد الموعد.
          </p>
        </div>
        
        <BookingForm services={servicesList} />
        
        {/* Client Login Section */}
        <div className="mt-10 bg-pink-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-3 text-primary">انضمي لعائلة منال الجمال</h3>
          <p className="text-gray-700 mb-4">
            سجلي الدخول أو أنشئي حساباً جديداً للحصول على عروض حصرية وخصومات مميزة على خدماتنا. كوني جزءاً من عائلتنا واستمتعي بتجربة فريدة من نوعها!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/login" 
              className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-white border border-primary text-primary hover:bg-gray-50 py-2 px-6 rounded-md transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            * احصلي على خصم 10% على الحجز الأول بعد إنشاء حساب جديد
          </p>
        </div>
        
        <div className="mt-10 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">معلومات مهمة</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>يرجى الحضور قبل الموعد بـ 10 دقائق</li>
            <li>في حالة الرغبة بإلغاء الموعد، يرجى إبلاغنا قبل 24 ساعة على الأقل</li>
            <li>يمكنك التواصل معنا على الرقم 0924275555 لأي استفسار</li>
            <li>ساعات العمل من 10 صباحاً حتى 8 مساءً من السبت إلى الخميس</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 