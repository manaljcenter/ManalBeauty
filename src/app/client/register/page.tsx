import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد | منال بيوتي',
  description: 'إنشاء حساب جديد في منال بيوتي للوصول إلى خدماتنا',
};

export default function RegisterPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">إنشاء حساب جديد</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <SignUpForm />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <a href="/client/login" className="text-pink-600 hover:underline">
                تسجيل الدخول
              </a>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 