'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const router = useRouter();
  const [clientName, setClientName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if client is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/client/me');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        
        const data = await response.json();
        setClientName(data.client.name);
      } catch (error) {
        // Redirect to login if not authenticated
        router.push('/client/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/client/logout', { method: 'POST' });
      router.push('/client/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-pink-600">
            منال بيوتي
          </Link>
          
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <Link href="/client/profile" className="text-gray-700 hover:text-pink-600">
              الملف الشخصي
            </Link>
            <Link href="/client/treatments" className="text-gray-700 hover:text-pink-600">
              خطط العلاج
            </Link>
            <Link href="/client/bookings" className="text-gray-700 hover:text-pink-600">
              الحجوزات
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="text-gray-700">مرحباً، {clientName}</span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="bg-white border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} منال بيوتي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
} 