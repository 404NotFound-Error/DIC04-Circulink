import { useState, useEffect, useCallback } from 'react';
import { apiClient, AUTH_TOKEN_CHANGED_EVENT, User } from '../lib/api';
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
  const enableDevAutoLogin =
    import.meta.env.DEV &&
    String(import.meta.env.VITE_ENABLE_DEV_AUTO_LOGIN || '').toLowerCase() === 'true';

  const loadSession = useCallback(async (allowDevAutoLogin = false) => {
    const { user: currentUser } = await getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const { data: profileData } = await getProfile(currentUser.id);
      setProfile(profileData);
      return;
    }

    setProfile(null);

    // Optional dev helper: auto-login test account only when explicitly enabled.
    if (allowDevAutoLogin && enableDevAutoLogin) {
      try {
        const email = (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com';
        const password = (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123';
        const loginResult = await apiClient.login(email, password);
        if (loginResult.user) {
          setUser(loginResult.user);
          const { data: profileData } = await getProfile(loginResult.user.id);
          setProfile(profileData);
        }
      } catch {
        // ignore errors when auto-login is enabled
      }
    }
  }, [enableDevAutoLogin]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      await loadSession(true);
      if (mounted) {
        setLoading(false);
      }
    };

    const onAuthChanged = async () => {
      await loadSession(false);
    };

    const onStorage = async (event: StorageEvent) => {
      if (event.key === 'access_token') {
        await loadSession(false);
      }
    };

    bootstrap();
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, onAuthChanged);
    window.addEventListener('storage', onStorage);

    return () => {
      mounted = false;
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadSession]);

  const refreshProfile = async () => {
    await loadSession(false);
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    refreshProfile
  };
};
