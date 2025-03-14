'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ServiceCreateForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    image: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset previous errors
    setError(null);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم. يرجى تحميل صورة بصيغة JPEG أو PNG أو WebP');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'فشل في تحميل الصورة');
      }
      
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        image: data.url
      }));
      
      setSuccess('تم رفع الصورة بنجاح');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل الصورة');
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : 0,
          duration: formData.duration ? Number(formData.duration) : 0,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'فشل في إنشاء الخدمة');
      }
      
      setSuccess('تم إنشاء الخدمة بنجاح');
      
      // Redirect to services list after a delay
      setTimeout(() => {
        router.push('/admin/services');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error('Error creating service:', err);
      setError(err.message || 'حدث خطأ أثناء إنشاء الخدمة');
    } finally {
      setIsLoading(false);
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">معلومات الخدمة</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                اسم الخدمة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                وصف الخدمة
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
          
          {/* Price and Duration */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              السعر (د.ل) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              المدة (دقيقة) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              الفئة <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">اختر الفئة</option>
              <option value="facial">العناية بالوجه</option>
              <option value="hair_removal">إزالة الشعر</option>
              <option value="skin_treatment">علاج البشرة</option>
              <option value="massage">المساج</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          
          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة الخدمة
            </label>
            
            <div className="mt-1 flex flex-col space-y-4">
              {/* Image Preview */}
              {previewImage && (
                <div className="relative w-full max-w-xs h-48 border rounded-md overflow-hidden">
                  <Image 
                    src={previewImage} 
                    alt="معاينة الصورة" 
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* File Input */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {isUploading ? 'جاري التحميل...' : 'اختر صورة'}
                </label>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={isUploading}
                />
                {formData.image && (
                  <span className="text-sm text-green-600">تم تحميل الصورة بنجاح</span>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                يجب أن تكون الصورة بصيغة JPG أو PNG أو WebP، وبحجم أقصى 5 ميجابايت.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء الخدمة'}
          </button>
        </div>
      </form>
    </div>
  );
} 