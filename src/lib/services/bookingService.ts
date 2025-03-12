import { supabase } from '../supabase';
import { getClientProfileByEmail, createClientProfile } from './clientProfileService';
import { createTreatmentPlan, createTreatmentSession } from './treatmentService';

// Define the Booking interface
export interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  date: string;
  time: string;
  service_id: string;
  status: string;
  notes: string;
  created_at: string;
  client_id?: string;
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    image: string;
  };
}

/**
 * Get all bookings with service details
 */
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services (*)
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('فشل في جلب الحجوزات');
  }

  return data || [];
}

/**
 * Get a booking by ID with service details
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    throw new Error('فشل في جلب الحجز');
  }

  return data;
}

/**
 * Get bookings by client ID
 */
export async function getBookingsByClientId(clientId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services (*)
    `)
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching client bookings:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new booking with client profile
 */
export async function createBooking(bookingData: {
  client_name: string;
  client_phone: string;
  client_email: string;
  date: string;
  time: string;
  service_id: string;
  notes?: string;
  total_sessions?: number;
}): Promise<Booking> {
  try {
    // Check if client profile exists
    let clientProfile = await getClientProfileByEmail(bookingData.client_email);
    
    // If client doesn't exist, create a new profile
    if (!clientProfile) {
      clientProfile = await createClientProfile({
        name: bookingData.client_name,
        email: bookingData.client_email,
        phone: bookingData.client_phone
      });
      console.log('Created new client profile:', clientProfile.id);
    }
    
    // Create the booking with client_id
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          ...bookingData,
          client_id: clientProfile.id,
          status: 'pending'
        }
      ])
      .select(`
        *,
        services (*)
      `)
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('فشل في إنشاء الحجز');
    }
    
    // If total_sessions is provided, create a treatment plan
    if (bookingData.total_sessions && bookingData.total_sessions > 0) {
      const treatmentPlan = await createTreatmentPlan({
        client_id: clientProfile.id,
        booking_id: data.id,
        service_id: bookingData.service_id,
        total_sessions: bookingData.total_sessions
      });
      
      // Create the first session
      await createTreatmentSession({
        treatment_plan_id: treatmentPlan.id,
        session_number: 1,
        session_date: bookingData.date,
        session_time: bookingData.time
      });
      
      console.log('Created treatment plan and first session:', treatmentPlan.id);
    }

    return data;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw new Error('فشل في إنشاء الحجز');
  }
}

/**
 * Update a booking status
 */
export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      services (*)
    `)
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw new Error('فشل في تحديث حالة الحجز');
  }

  return data;
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting booking:', error);
    throw new Error('فشل في حذف الحجز');
  }
} 