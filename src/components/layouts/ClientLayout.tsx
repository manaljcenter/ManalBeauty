'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navItems = [
    { name: 'الرئيسية', path: '/client/dashboard' },
    { name: 'الحجوزات', path: '/client/bookings' },
    { name: 'خطط العلاج', path: '/client/treatments' },
    { name: 'التقارير', path: '/client/reports' },
    { name: 'الملف الشخصي', path: '/client/profile' },
  ];
  
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      const response = await fetch('/api/client/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('فشل تسجيل الخروج');
      }
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              منال بيوتي
            </Link>
            
            <nav className="hidden md:flex space-x-4 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.path
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-gray-700 hover:text-pink-600 disabled:opacity-50"
              >
                {isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-white border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} منال بيوتي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
} 