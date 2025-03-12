import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import ClientLayout from '@/components/layouts/ClientLayout';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | منال بيوتي',
  description: 'تسجيل الدخول إلى حسابك في منال بيوتي',
};

export default function LoginPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">تسجيل الدخول</h1>
        <LoginForm />
      </div>
    </ClientLayout>
  );
} 