'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TreatmentPlansList from './TreatmentPlansList';
import BookingsList from './BookingsList';
import ClientProfileDetails from './ClientProfileDetails';

interface ClientDashboardProps {
  initialTab?: string;
}

export default function ClientDashboard({ initialTab = 'profile' }: ClientDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await fetch('/api/client/profile', {
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push('/client/login');
            return;
          }
          throw new Error('فشل في جلب بيانات الملف الشخصي');
        }

        const data = await response.json();
        setClientProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchClientProfile();
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => handleTabChange('profile')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الملف الشخصي
          </button>
          <button
            onClick={() => handleTabChange('treatments')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'treatments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            خطط العلاج
          </button>
          <button
            onClick={() => handleTabChange('bookings')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الحجوزات
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'profile' && clientProfile && (
          <ClientProfileDetails profile={clientProfile} />
        )}
        
        {activeTab === 'treatments' && clientProfile && (
          <TreatmentPlansList clientId={clientProfile.id} />
        )}
        
        {activeTab === 'bookings' && clientProfile && (
          <BookingsList clientId={clientProfile.id} />
        )}
      </div>
    </div>
  );
} 