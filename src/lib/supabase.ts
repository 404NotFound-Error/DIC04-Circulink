import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: {
  full_name: string;
  university: string;
  phone?: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

// Sign in using test account credentials from env (for local development)
export const signInTestUser = async () => {
  const email = import.meta.env.VITE_TEST_EMAIL as string | undefined;
  const password = import.meta.env.VITE_TEST_PASSWORD as string | undefined;

  if (!email || !password) {
    throw new Error('Set VITE_TEST_EMAIL and VITE_TEST_PASSWORD in your .env');
  }

  return await signIn(email, password);
};

// Dev helper: create the test user (if needed) and sign in.
export const createAndSignInTestUser = async () => {
  if (!import.meta.env.DEV) {
    throw new Error('createAndSignInTestUser is available only in development');
  }

  const email = (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com';
  const password = (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123';

  // Try signing in first
  let { data, error } = await signIn(email, password);
  if (!error) return { data, error: null };

  // If sign-in failed, attempt to sign up the user
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Test User',
        university: 'Test University',
        phone: null
      }
    }
  });

  if (signupError) {
    // If sign-up failed for some reason other than "user exists", return the error
    return { data: signupData, error: signupError };
  }

  // Try signing in again after sign-up
  const { data: data2, error: error2 } = await signIn(email, password);
  return { data: data2, error: error2 };
};
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Items helpers
export const getItems = async (filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  status?: string;
}) => {
  let query = supabase
    .from('items')
    .select(`
      *,
      category:categories(name, icon),
      seller:profiles(full_name, avatar_url, university),
      favorites(user_id)
    `)
    .eq('status', filters?.status || 'available')
    .order('created_at', { ascending: false });

  if (filters?.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', filters.category)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters?.condition && filters.condition.length > 0) {
    query = query.in('condition', filters.condition);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getItem = async (itemId: string) => {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name, icon),
      seller:profiles(full_name, avatar_url, university, phone)
    `)
    .eq('id', itemId)
    .single();
  
  if (data) {
    // Increment view count
    await supabase.rpc('increment_item_views', { item_uuid: itemId });
  }
  
  return { data, error };
};

export const createItem = async (itemData: any) => {
  const { data, error } = await supabase
    .from('items')
    .insert(itemData)
    .select(`
      *,
      category:categories(name, icon),
      seller:profiles(full_name, avatar_url, university)
    `)
    .single();
  return { data, error };
};

export const updateItem = async (itemId: string, updates: any) => {
  const { data, error } = await supabase
    .from('items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select(`
      *,
      category:categories(name, icon),
      seller:profiles(full_name, avatar_url, university)
    `)
    .single();
  return { data, error };
};

export const deleteItem = async (itemId: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);
  return { error };
};

// Categories helpers
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return { data, error };
};

// Favorites helpers
export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      item:items(
        *,
        category:categories(name, icon),
        seller:profiles(full_name, avatar_url, university)
      )
    `)
    .eq('user_id', userId);
  return { data, error };
};

export const addToFavorites = async (userId: string, itemId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, item_id: itemId })
    .select()
    .single();
  return { data, error };
};

export const removeFromFavorites = async (userId: string, itemId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId);
  return { error };
};

// Messages helpers
export const getMessages = async (userId: string, itemId?: string) => {
  let query = supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url),
      item:items(title, price)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (itemId) {
    query = query.eq('item_id', itemId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const sendMessage = async (messageData: {
  sender_id: string;
  receiver_id: string;
  item_id: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url),
      item:items(title, price)
    `)
    .single();
  return { data, error };
};

export const markMessageAsRead = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);
  return { error };
};