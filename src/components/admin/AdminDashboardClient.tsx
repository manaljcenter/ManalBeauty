'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if we have an admin session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // If no valid session, redirect to login
          router.push('/admin/login');
          return;
        }

        // Session is valid, mark as loaded
        setIsLoaded(true);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [router]);

  return null; // This component doesn't render anything visible
} 