'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function ClientProfileBookingForm() {
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
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  
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
  
  // Update price when service changes
  useEffect(() => {
    if (serviceId) {
      const selectedService = services.find(service => service.id === serviceId);
      if (selectedService) {
        setOriginalPrice(selectedService.price);
        updateFinalPrice(selectedService.price, discountAmount);
      }
    } else {
      setOriginalPrice(0);
      setFinalPrice(0);
    }
  }, [serviceId, services]);
  
  const updateFinalPrice = (price: number, discount: number) => {
    const discountedPrice = Math.max(0, price - discount);
    setFinalPrice(discountedPrice);
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceId(e.target.value);
    setDiscountApplied(false);
    setDiscountAmount(0);
  };
  
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }
    
    if (!serviceId) {
      toast.error('يرجى اختيار الخدمة أولاً');
      return;
    }
    
    try {
      const response = await fetch('/api/client/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode,
          service_id: serviceId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'كود الخصم غير صالح');
        return;
      }
      
      // Apply discount
      setDiscountApplied(true);
      setDiscountAmount(data.discount_amount);
      updateFinalPrice(originalPrice, data.discount_amount);
      toast.success('تم تطبيق الخصم بنجاح');
    } catch (err) {
      console.error('Error applying discount:', err);
      toast.error('حدث خطأ أثناء تطبيق الخصم');
    }
  };
  
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
          notes,
          discount_code: discountApplied ? discountCode : null,
          final_price: finalPrice
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
      setDiscountCode('');
      setDiscountApplied(false);
      setDiscountAmount(0);
      
      // Refresh bookings list
      router.refresh();
      
      // Show success message
      toast.success('تم إنشاء الحجز بنجاح');
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'حدث خطأ أثناء إنشاء الحجز');
      toast.error(err.message || 'حدث خطأ أثناء إنشاء الحجز');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">جاري تحميل الخدمات...</div>;
  }
  
  return (
    <div>
      <Toaster position="top-center" />
      
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            الخدمة
          </label>
          <select
            id="service"
            value={serviceId}
            onChange={handleServiceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">اختر الخدمة</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} د.ل
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            التاريخ
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            الوقت
          </label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
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
          </select>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-end gap-2 mb-2">
            <div className="flex-grow">
              <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 mb-1">
                كود الخصم
              </label>
              <input
                type="text"
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل كود الخصم"
                disabled={discountApplied}
              />
            </div>
            <button
              type="button"
              onClick={handleApplyDiscount}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
              disabled={!discountCode || discountApplied || submitting}
            >
              تطبيق
            </button>
          </div>
          
          {serviceId && (
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span>السعر الأصلي:</span>
                <span>{originalPrice} د.ل</span>
              </div>
              
              {discountApplied && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم:</span>
                  <span>- {discountAmount} د.ل</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold mt-1 pt-1 border-t">
                <span>السعر النهائي:</span>
                <span>{finalPrice} د.ل</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {submitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </button>
        </div>
      </form>
    </div>
  );
} 