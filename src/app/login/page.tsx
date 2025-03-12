import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | منال للتجميل',
  description: 'تسجيل الدخول إلى لوحة تحكم مركز منال للتجميل',
};

export default function LoginPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-primary mb-6">
            تسجيل الدخول
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
} 