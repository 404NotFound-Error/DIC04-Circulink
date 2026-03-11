import { apiClient, ApiError } from './api';
import type { CreateItemInput } from './api';

type ProfileUpdates = Partial<{
  full_name: string;
  university: string;
  phone: string | null;
  avatar_url: string | null;
}>;

const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:change'));
  }
};

const AUTO_LOGIN_DISABLED_KEY = 'circulink.disableAutoLogin';

// Auth helpers (migrated from Supabase to Express API)
export const signUp = async (email: string, password: string, userData: {
  full_name: string;
  university?: string;
  phone?: string;
}) => {
  try {
    const response = await apiClient.register({
      email,
      password,
      name: userData.full_name
    });
    localStorage.removeItem(AUTO_LOGIN_DISABLED_KEY);
    emitAuthChange();
    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await apiClient.login(email, password);
    localStorage.removeItem(AUTO_LOGIN_DISABLED_KEY);
    emitAuthChange();
    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
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
  const { data, error } = await signIn(email, password);
  if (!error) return { data, error: null };

  // If sign-in failed, attempt to sign up the user
  const { data: signupData, error: signupError } = await signUp(email, password, {
    full_name: 'Test User',
    university: 'Test University',
    phone: undefined
  });

  if (signupError) {
    return { data: signupData, error: signupError };
  }

  // Try signing in again after sign-up
  const { data: data2, error: error2 } = await signIn(email, password);
  return { data: data2, error: error2 };
};

export const signOut = async () => {
  try {
    await apiClient.logout();
    localStorage.setItem(AUTO_LOGIN_DISABLED_KEY, 'true');
    emitAuthChange();
    return { error: null };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.getCurrentUser();
    return { user: response.user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

// Profile helpers (simplified - backend doesn't have separate profiles table yet)
export const getProfile = async (userId: string) => {
  // For now, just return user data as profile
  try {
    const { user } = await getCurrentUser();
    if (user && user.id === userId) {
      return { 
        data: {
          id: user.id,
          email: user.email,
          full_name: user.name || '',
          avatar_url: null,
          university: '',
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    return { data: null, error: new Error('User not found') };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const updateProfile = async (userId: string, updates: ProfileUpdates) => {
  // Backend doesn't support profile updates yet - return success for now
  return { data: { id: userId, ...updates }, error: null };
};

// Items helpers (migrated to Express API)
export const getItems = async (filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  status?: string;
}) => {
  try {
    const response = await apiClient.getItems({
      categoryId: filters?.category,
      q: filters?.search,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      condition: filters?.condition?.[0], // Backend expects single condition
      status: filters?.status
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const getItem = async (itemId: string) => {
  try {
    const response = await apiClient.getItem(itemId);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const createItem = async (itemData: CreateItemInput) => {
  try {
    const response = await apiClient.createItem(itemData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const updateItem = async (itemId: string, updates: Partial<CreateItemInput>) => {
  try {
    const response = await apiClient.updateItem(itemId, updates);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const deleteItem = async (itemId: string) => {
  try {
    await apiClient.deleteItem(itemId);
    return { error: null };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

// Categories helpers
export const getCategories = async () => {
  try {
    const response = await apiClient.getCategories();
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

// Favorites helpers
export const getFavorites = async (_userId: string) => {
  void _userId;
  try {
    const response = await apiClient.getFavorites();
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const addToFavorites = async (_userId: string, itemId: string) => {
  try {
    const response = await apiClient.addFavorite(itemId);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const removeFromFavorites = async (userId: string, itemId: string) => {
  try {
    // Get favorites to find favorite ID
    const favs = await apiClient.getFavorites();
    const favorite = favs.data.find((f) => f.itemId === itemId && f.userId === userId);
    if (favorite) {
      await apiClient.removeFavorite(favorite.id);
    }
    return { error: null };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

// Messages helpers
export const getMessages = async (_userId: string, itemId?: string) => {
  try {
    const response = await apiClient.getThreads({ itemId });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const sendMessage = async (messageData: {
  sender_id: string;
  receiver_id: string;
  item_id: string;
  content: string;
}) => {
  try {
    const response = await apiClient.sendMessage({
      itemId: messageData.item_id,
      recipientId: messageData.receiver_id,
      body: messageData.content
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    await apiClient.markMessageRead(messageId);
    return { error: null };
  } catch (error) {
    return { error: error instanceof ApiError ? error : new Error(String(error)) };
  }
};
