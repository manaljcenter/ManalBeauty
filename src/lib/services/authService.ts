import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> {
  // Hash the password
  const hashedPassword = await hashPassword(userData.password);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error('فشل في إنشاء المستخدم');
  }

  return data;
} 