import { supabase } from '../supabase';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'facial' | 'hair_removal' | 'skin_treatment' | 'massage' | 'other';
  image: string;
  created_at: string;
}

/**
 * Get all services
 */
export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching services:', error);
    throw new Error('فشل في جلب الخدمات');
  }

  return data || [];
}

/**
 * Get a service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw new Error('فشل في جلب الخدمة');
  }

  return data;
}

/**
 * Create a new service
 */
export async function createService(serviceData: {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'facial' | 'hair_removal' | 'skin_treatment' | 'massage' | 'other';
  image?: string;
}): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw new Error('فشل في إنشاء الخدمة');
  }

  return data;
}

/**
 * Update a service
 */
export async function updateService(
  id: string,
  serviceData: Partial<Omit<Service, 'id' | 'created_at'>>
): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw new Error('فشل في تحديث الخدمة');
  }

  return data;
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw new Error('فشل في حذف الخدمة');
  }
} 