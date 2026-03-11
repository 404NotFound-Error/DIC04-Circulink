import { useState, useEffect } from 'react';
import { apiClient, User } from '../lib/api';
import { getCurrentUser, getProfile } from '../lib/backend';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  university: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const getInitialSession = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profileData } = await getProfile(currentUser.id);
        setProfile(profileData);
      }
      
      // If no user and in dev, try auto-login with test credentials
    const autoLoginDisabled = typeof window !== 'undefined' && localStorage.getItem('circulink.disableAutoLogin') === 'true';
    if (!currentUser && import.meta.env.DEV && !autoLoginDisabled) {
        try {
          const email = (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com';
          const password = (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123';

          // Try login
          const loginResult = await apiClient.login(email, password);
          if (loginResult.user) {
            setUser(loginResult.user);
            const { data: profileData } = await getProfile(loginResult.user.id);
            setProfile(profileData);
          }
        } catch {
          // Try register then login
          try {
            await apiClient.register({
              email: (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com',
              password: (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123',
              name: 'Test User'
            });
            const loginResult = await apiClient.login(
              (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com',
              (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123'
            );
            if (loginResult.user) {
              setUser(loginResult.user);
              const { data: profileData } = await getProfile(loginResult.user.id);
              setProfile(profileData);
            }
          } catch {
            // ignore errors in dev
          }
        }
      }

    setLoading(false);
  };

  useEffect(() => {
    getInitialSession();

    const handleAuthChange = () => {
      setLoading(true);
      getInitialSession();
    };

    window.addEventListener('auth:change', handleAuthChange);
    return () => {
      window.removeEventListener('auth:change', handleAuthChange);
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user
  };
};
