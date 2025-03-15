import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import bcrypt from 'bcrypt';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get a client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getClientById:', error);
    return null;
  }
}

/**
 * Get a client by email
 */
export async function getClientByEmail(email: string): Promise<Client | null> {
  try {
    const supabase = createSupabaseClient();
    
    // First, try to get all clients with this email
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching client by email:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log('No client found with email:', email);
      return null;
    }
    
    if (data.length > 1) {
      console.log(`Warning: Found ${data.length} clients with email ${email}. Using the first one.`);
    }
    
    // Return the first client
    return data[0];
  } catch (error) {
    console.error('Unexpected error in getClientByEmail:', error);
    return null;
  }
}

/**
 * Create a new client
 */
export async function createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
  try {
    // Create client data object
    const clientData: any = {
      name: client.name,
      email: client.email,
      phone: client.phone || '',
    };
    
    // Hash the password if provided
    if (client.password) {
      clientData.password = await bcrypt.hash(client.password, 10);
    }
    
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in createClient:', error);
    return null;
  }
}

/**
 * Update a client
 */
export async function updateClient(id: string, client: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<Client | null> {
  try {
    // Create update data object
    const updateData: any = { ...client };
    
    // If password is being updated, hash it
    if (client.password) {
      updateData.password = await bcrypt.hash(client.password, 10);
    }
    
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, phone, created_at, updated_at')
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in updateClient:', error);
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in deleteClient:', error);
    return false;
  }
}

export async function verifyClientPassword(client: Client, password: string): Promise<boolean> {
  try {
    if (!client.password) {
      console.error('Client has no password');
      return false;
    }
    
    return await bcrypt.compare(password, client.password);
  } catch (error) {
    console.error('Error verifying client password:', error);
    return false;
  }
}

export async function getAllClients(): Promise<Client[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all clients:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getAllClients:', error);
    return [];
  }
}

/**
 * Authenticate a client by email and password
 */
export async function authenticateClient(email: string, password: string): Promise<Client | null> {
  try {
    // Get client by email
    const client = await getClientByEmail(email);
    
    if (!client) {
      console.error('Client not found with email:', email);
      return null;
    }
    
    // Verify password
    const isPasswordValid = await verifyClientPassword(client, password);
    
    if (!isPasswordValid) {
      console.error('Invalid password for client:', email);
      return null;
    }
    
    // Return client without password
    const { password: _, ...clientWithoutPassword } = client;
    return clientWithoutPassword as Client;
  } catch (error) {
    console.error('Unexpected error in authenticateClient:', error);
    return null;
  }
} 