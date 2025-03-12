'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseInitialized, setSupabaseInitialized] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const supabase = createClient();
  
  // Check if Supabase is properly initialized
  useEffect(() => {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are not properly set:', { 
        url: supabaseUrl ? 'Set' : 'Missing', 
        anonKey: supabaseAnonKey ? 'Set' : 'Missing' 
      });
      setSupabaseInitialized(false);
      toast.error('خطأ في إعدادات النظام. يرجى الاتصال بالمسؤول.');
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is initialized
    if (!supabaseInitialized) {
      toast.error('خطأ في إعدادات النظام. يرجى الاتصال بالمسؤول.');
      return;
    }
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First check if the email already exists in the auth system
      console.log('Checking if email already exists:', formData.email);
      
      // Check in the clients table first
      const { data: existingClient, error: clientCheckError } = await supabase
        .from('clients')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();
      
      if (existingClient) {
        console.log('Email already exists in clients table:', existingClient);
        toast.error('البريد الإلكتروني مسجل بالفعل');
        setIsLoading(false);
        return;
      }
      
      if (clientCheckError) {
        console.error('Error checking existing client:', clientCheckError);
      }
      
      // Register user with Supabase Auth
      console.log('Attempting to register with Supabase Auth:', { 
        email: formData.email,
        // Don't log the actual password
        passwordLength: formData.password.length,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });
      
      console.log('Supabase Auth response:', { 
        success: !authError, 
        userId: authData?.user?.id,
        error: authError ? 'Error occurred' : 'None'
      });
      
      if (authError) {
        throw authError;
      }
      
      // Check if user was created successfully
      if (!authData.user || !authData.user.id) {
        throw new Error('لم يتم إنشاء المستخدم بشكل صحيح');
      }
      
      // Create client profile in clients table
      console.log('Attempting to create client profile:', {
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        // Don't log the actual password
        passwordIncluded: true
      });
      
      const { error: profileError } = await supabase
        .from('clients')
        .insert({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password // Add the password field
        });
      
      console.log('Client profile creation response:', {
        success: !profileError,
        error: profileError ? 'Error occurred' : 'None'
      });
      
      if (profileError) {
        throw profileError;
      }
      
      toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب');
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Log more detailed error information
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status
      });
      
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      
      // Handle specific error cases
      if (error.message?.includes('already registered')) {
        errorMessage = 'البريد الإلكتروني مسجل بالفعل';
      } else if (error.code === '23505' || error.message?.includes('unique constraint')) {
        // This is a PostgreSQL unique constraint violation error
        errorMessage = 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل';
      } else if (error.code === '23503') {
        // This is a PostgreSQL foreign key constraint violation error
        errorMessage = 'خطأ في العلاقات بين الجداول';
      } else if (error.code === '23502') {
        // This is a PostgreSQL not-null constraint violation error
        errorMessage = 'بعض البيانات المطلوبة غير موجودة';
      } else if (error.code === '42P01') {
        // This is a PostgreSQL undefined table error
        errorMessage = 'خطأ في هيكل قاعدة البيانات';
      } else if (error.code === '42703') {
        // This is a PostgreSQL undefined column error
        errorMessage = 'خطأ في هيكل قاعدة البيانات';
      } else if (error.code === '28P01') {
        // This is a PostgreSQL invalid password error
        errorMessage = 'كلمة المرور غير صالحة';
      } else if (error.code === '28000') {
        // This is a PostgreSQL invalid authorization specification error
        errorMessage = 'خطأ في المصادقة';
      } else if (error.code) {
        // For other error codes, show a more detailed message
        errorMessage = `خطأ: ${error.message} (${error.code})`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <Toaster position="top-center" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
            dir="ltr"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
            dir="ltr"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
            dir="ltr"
            minLength={6}
          />
          <p className="mt-1 text-xs text-gray-500">
            يجب أن تكون كلمة المرور 6 أحرف على الأقل
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
            dir="ltr"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="mr-2 block text-sm text-gray-700">
            أوافق على <a href="/terms" className="text-primary hover:underline">الشروط والأحكام</a> و <a href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</a>
          </label>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </div>
      </form>
    </div>
  );
} 