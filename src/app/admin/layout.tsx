'use client';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-primary">
            منال للتجميل - لوحة التحكم
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-6">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                الرئيسية
              </Link>
              <Link 
                href="/admin/services" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                الخدمات
              </Link>
              <Link 
                href="/admin/bookings" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                الحجوزات
              </Link>
            </nav>
            <LogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
} 