import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | منال للتجميل',
  description: 'تسجيل الدخول إلى حسابك في مركز منال للتجميل',
};

export default function LoginPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">
            أهلاً بك مجدداً في عائلة منال الجمال
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                إنشاء حساب جديد
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