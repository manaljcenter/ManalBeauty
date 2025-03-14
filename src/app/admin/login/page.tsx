'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Client component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get('redirect') || '/admin' : '/admin';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('تم تسجيل الدخول بنجاح');
        
        // Wait a moment for the toast to be visible
        setTimeout(() => {
          // Redirect to the specified path or admin dashboard
          router.push(redirectPath);
          router.refresh(); // Force a refresh to ensure the page reloads with the new session
        }, 1000);
      } else {
        toast.error(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">البريد الإلكتروني</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="البريد الإلكتروني"
            dir="ltr"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">كلمة المرور</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="كلمة المرور"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </div>
    </form>
  );
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="h-10 bg-gray-200 rounded-t-md animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-b-md animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
}

// Main page component
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary">منال للتجميل</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">تسجيل الدخول للوحة التحكم</h2>
        </div>
        
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
} 