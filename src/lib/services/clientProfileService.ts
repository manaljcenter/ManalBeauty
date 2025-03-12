import { supabase } from '../supabase';
import bcrypt from 'bcryptjs';

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get a client profile by email
 */
export async function getClientProfileByEmail(email: string): Promise<ClientProfile | null> {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching client profile:', error);
    return null;
  }

  return data;
}

/**
 * Get a client profile by ID
 */
export async function getClientProfileById(id: string): Promise<ClientProfile | null> {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching client profile:', error);
    return null;
  }

  return data;
}

/**
 * Create a new client profile
 */
export async function createClientProfile(profileData: {
  name: string;
  email: string;
  phone: string;
  password?: string;
}): Promise<ClientProfile> {
  let dataToInsert = { ...profileData };
  
  // Hash the password if provided
  if (profileData.password) {
    const hashedPassword = await bcrypt.hash(profileData.password, 10);
    dataToInsert.password = hashedPassword;
  }

  const { data, error } = await supabase
    .from('client_profiles')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error creating client profile:', error);
    throw new Error('فشل في إنشاء الملف الشخصي');
  }

  return data;
}

/**
 * Update a client profile
 */
export async function updateClientProfile(
  id: string,
  profileData: Partial<ClientProfile>
): Promise<ClientProfile> {
  // If updating password, hash it first
  if (profileData.password) {
    profileData.password = await bcrypt.hash(profileData.password, 10);
  }

  const { data, error } = await supabase
    .from('client_profiles')
    .update(profileData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client profile:', error);
    throw new Error('فشل في تحديث الملف الشخصي');
  }

  return data;
}

/**
 * Verify a client's password
 */
export async function verifyClientPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * Get all client profiles
 */
export async function getAllClientProfiles(): Promise<ClientProfile[]> {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client profiles:', error);
    return [];
  }

  return data || [];
}

/**
 * Delete a client profile
 */
export async function deleteClientProfile(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('client_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client profile:', error);
    return false;
  }

  return true;
} 