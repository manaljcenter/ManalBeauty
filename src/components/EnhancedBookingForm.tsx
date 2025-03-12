'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientProfileForm from './ClientProfileForm';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
}

interface EnhancedBookingFormProps {
  services: Service[];
}

export default function EnhancedBookingForm({ services }: EnhancedBookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    date: '',
    time: '',
    service_id: '',
    notes: '',
    total_sessions: 1,
    create_account: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'total_sessions') {
      // Ensure total_sessions is at least 1
      const sessions = Math.max(1, parseInt(value) || 1);
      setFormData(prev => ({ ...prev, [name]: sessions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    setFormData(prev => ({ ...prev, service_id: serviceId }));
  };

  const validateStep1 = () => {
    if (!formData.service_id) {
      setError('الرجاء اختيار الخدمة');
      return false;
    }
    if (!formData.date) {
      setError('الرجاء اختيار التاريخ');
      return false;
    }
    if (!formData.time) {
      setError('الرجاء اختيار الوقت');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleClientProfileSubmit = async (profileData: any) => {
    setFormData(prev => ({
      ...prev,
      client_name: profileData.name,
      client_email: profileData.email,
      client_phone: profileData.phone,
    }));
    
    await handleSubmit();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          date: formData.date,
          time: formData.time,
          service_id: formData.service_id,
          notes: formData.notes,
          total_sessions: formData.total_sessions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء إنشاء الحجز');
      }

      setBookingId(data.id);
      setSuccess('تم إنشاء الحجز بنجاح! سنتواصل معك قريبًا لتأكيد الحجز.');
      setStep(3);

      // If user wants to create an account, redirect to registration page
      if (formData.create_account) {
        router.push(`/client/register?email=${encodeURIComponent(formData.client_email)}&name=${encodeURIComponent(formData.client_name)}&phone=${encodeURIComponent(formData.client_phone)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحجز');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = () => {
    if (bookingId) {
      router.push(`/booking/confirmation/${bookingId}`);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">اختيار الخدمة والموعد</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-1">
              الخدمة
            </label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleServiceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="">اختر الخدمة</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price} ريال
                </option>
              ))}
            </select>
          </div>

          {formData.service_id && (
            <div>
              <label htmlFor="total_sessions" className="block text-sm font-medium text-gray-700 mb-1">
                عدد الجلسات
              </label>
              <input
                id="total_sessions"
                name="total_sessions"
                type="number"
                min="1"
                value={formData.total_sessions}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <p className="mt-1 text-sm text-gray-500">
                حدد عدد الجلسات المطلوبة لهذه الخدمة
              </p>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              التاريخ
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              الوقت
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات إضافية
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="أي ملاحظات إضافية تود إضافتها"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                id="client_name"
                name="client_name"
                type="text"
                value={formData.client_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="client_email"
                name="client_email"
                type="email"
                value={formData.client_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="أدخل البريد الإلكتروني"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                id="client_phone"
                name="client_phone"
                type="tel"
                value={formData.client_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="أدخل رقم الهاتف"
                dir="ltr"
              />
            </div>

            <div className="flex items-center">
              <input
                id="create_account"
                name="create_account"
                type="checkbox"
                checked={formData.create_account}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="create_account" className="mr-2 block text-sm text-gray-700">
                إنشاء حساب لمتابعة الحجوزات والجلسات
              </label>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                السابق
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={handleViewBooking}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              عرض تفاصيل الحجز
            </button>
          </div>
          
          {formData.create_account && (
            <p className="text-sm text-gray-600 mt-4">
              سيتم توجيهك إلى صفحة إنشاء الحساب لإكمال عملية التسجيل.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 