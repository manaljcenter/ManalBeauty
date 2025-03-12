'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ClientProfileDetails() {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await fetch('/api/client/me');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/client/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setClient(data.client);
        setFormData({
          name: data.client.name,
          phone: data.client.phone,
        });
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setClient(data.client);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (!client) {
    return <div className="text-center py-4">لم يتم العثور على بيانات</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-pink-600">معلومات الحساب</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200"
          >
            تعديل
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              dir="ltr"
            />
          </div>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: client.name,
                  phone: client.phone,
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">الاسم</p>
            <p className="font-medium">{client.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="font-medium" dir="ltr">{client.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">رقم الهاتف</p>
            <p className="font-medium" dir="ltr">{client.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
} 