import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | منال بيوتي',
  description: 'تسجيل الدخول إلى حسابك في منال بيوتي',
};

export default function LoginPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">تسجيل الدخول</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <a href="/client/register" className="text-pink-600 hover:underline">
                إنشاء حساب
              </a>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 