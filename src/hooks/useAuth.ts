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

  useEffect(() => {
    const enableDevAutoLogin =
      import.meta.env.DEV &&
      String(import.meta.env.VITE_ENABLE_DEV_AUTO_LOGIN || '').toLowerCase() === 'true';

    // Get initial session
    const getInitialSession = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profileData } = await getProfile(currentUser.id);
        setProfile(profileData);
      }
      
      // Optional dev helper: auto-login test account only when explicitly enabled.
      if (!currentUser && enableDevAutoLogin) {
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
          // ignore errors when auto-login is enabled
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Note: current backend auth flow doesn't provide real-time auth state events
    // For now, we rely on initial load and explicit login/logout calls
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const { data: profileData } = await getProfile(user.id);
      setProfile(profileData);
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    refreshProfile
  };
};
