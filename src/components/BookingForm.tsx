'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  category: 'facial' | 'hair_removal' | 'skin_treatment' | 'massage' | 'other';
  image: string;
  created_at: string;
}

interface BookingFormProps {
  services: Service[];
}

export default function BookingForm({ services }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    service_id: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('تم حجز موعدك بنجاح!');
        // Reset form
        setFormData({
          client_name: '',
          client_phone: '',
          client_email: '',
          service_id: '',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        toast.error(data.message || 'حدث خطأ أثناء الحجز');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">احجزي موعدك الآن</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="client_phone"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="09xxxxxxxx"
          />
        </div>
        
        <div>
          <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني (اختياري)
          </label>
          <input
            type="email"
            id="client_email"
            name="client_email"
            value={formData.client_email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-1">
            الخدمة
          </label>
          <select
            id="service_id"
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">اختاري الخدمة</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} د.ل {service.duration ? `(${service.duration} دقيقة)` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              التاريخ
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              الوقت
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات (اختياري)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </button>
        </div>
      </form>
    </div>
  );
} 