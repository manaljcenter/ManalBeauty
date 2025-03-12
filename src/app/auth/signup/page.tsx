import { Metadata } from 'next';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد | منال للتجميل',
  description: 'انضمي إلى عائلة منال الجمال وتمتعي بعروض وخدمات حصرية',
};

export default function SignUpPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-600">
            انضمي إلى عائلة منال الجمال واحصلي على خصم 10% على الحجز الأول
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <SignUpForm />
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-600 hover:text-primary">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
} 