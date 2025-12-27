import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getProfile } from '../lib/supabase';

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
    // Get initial session
    const getInitialSession = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
      
      if (user) {
        const { data: profileData } = await getProfile(user.id);
        setProfile(profileData);
      }
      
      // If no user and in dev, create & sign in test user automatically (simple inline)
      if (!user && import.meta.env.DEV) {
        try {
          const email = (import.meta.env.VITE_TEST_EMAIL as string | undefined) ?? 'test@example.com';
          const password = (import.meta.env.VITE_TEST_PASSWORD as string | undefined) ?? 'password123';

          // Try sign-in
          const signInRes = await supabase.auth.signInWithPassword({ email, password });
          if (!signInRes.error && signInRes.data.user) {
            const newUser = signInRes.data.user;
            setUser(newUser);
            const { data: profileData } = await getProfile(newUser.id);
            setProfile(profileData);
          } else {
            // Try sign-up then sign-in
            await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name: 'Test User', university: 'Test University' } }
            });
            const signInRes2 = await supabase.auth.signInWithPassword({ email, password });
            if (!signInRes2.error && signInRes2.data.user) {
              const newUser = signInRes2.data.user;
              setUser(newUser);
              const { data: profileData } = await getProfile(newUser.id);
              setProfile(profileData);
            }
          }
        } catch {
          // ignore errors in dev
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profileData } = await getProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user
  };
};

// (dev auto-create handled inline in this file)