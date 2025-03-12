import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';
import ClientLayout from '@/components/layouts/ClientLayout';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد | منال بيوتي',
  description: 'إنشاء حساب جديد في منال بيوتي للوصول إلى خدماتنا',
};

export default function RegisterPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">إنشاء حساب جديد</h1>
        <SignUpForm />
      </div>
    </ClientLayout>
  );
} 