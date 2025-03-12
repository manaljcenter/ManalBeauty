'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function NewBookingForm() {
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        
        if (!response.ok) {
          throw new Error('فشل في جلب الخدمات');
        }
        
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('حدث خطأ أثناء تحميل الخدمات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!serviceId || !date || !time) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          date,
          time,
          notes
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'فشل في إنشاء الحجز');
      }
      
      setSuccess('تم إنشاء الحجز بنجاح');
      
      // Reset form
      setServiceId('');
      setDate('');
      setTime('');
      setNotes('');
      
      // Redirect to bookings page after a delay
      setTimeout(() => {
        router.push('/client/bookings');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'حدث خطأ أثناء إنشاء الحجز');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">جاري تحميل الخدمات...</div>;
  }
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">حجز موعد جديد</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-right">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-gray-700 text-right">الخدمة</label>
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            dir="rtl"
          >
            <option value="">اختر الخدمة</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} ريال
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-gray-700 text-right">التاريخ</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <div>
          <label htmlFor="time" className="block text-gray-700 text-right">الوقت</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            dir="rtl"
          >
            <option value="">اختر الوقت</option>
            <option value="09:00">09:00 صباحاً</option>
            <option value="10:00">10:00 صباحاً</option>
            <option value="11:00">11:00 صباحاً</option>
            <option value="12:00">12:00 ظهراً</option>
            <option value="13:00">01:00 مساءً</option>
            <option value="14:00">02:00 مساءً</option>
            <option value="15:00">03:00 مساءً</option>
            <option value="16:00">04:00 مساءً</option>
            <option value="17:00">05:00 مساءً</option>
            <option value="18:00">06:00 مساءً</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-gray-700 text-right">ملاحظات</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            dir="rtl"
            rows={3}
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
        >
          {submitting ? 'جاري إنشاء الحجز...' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  );
} 