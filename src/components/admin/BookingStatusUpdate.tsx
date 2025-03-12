'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingStatusUpdateProps {
  bookingId: string;
  currentStatus: string;
}

export default function BookingStatusUpdate({ bookingId, currentStatus }: BookingStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'فشل في تحديث حالة الحجز');
      }
      
      setSuccess('تم تحديث حالة الحجز بنجاح');
      
      // Refresh the page data
      router.refresh();
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة الحجز');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleStatusChange} className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            الحالة الجديدة
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || status === currentStatus}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جاري التحديث...' : 'تحديث الحالة'}
        </button>
      </form>
    </div>
  );
} 