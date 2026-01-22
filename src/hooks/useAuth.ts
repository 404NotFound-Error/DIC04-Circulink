import { useState, useEffect } from 'react';
import { getAuthState } from '../lib/auth';

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

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

const buildProfileFromUser = (user: AuthUser | null): Profile | null => {
  if (!user) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    id: user.id,
    email: user.email,
    full_name: user.name || user.email,
    avatar_url: null,
    university: '',
    phone: null,
    created_at: now,
    updated_at: now
  };
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromStorage = () => {
      const state = getAuthState();
      const nextUser = state?.user ?? null;
      setUser(nextUser);
      setProfile(buildProfileFromUser(nextUser));
      setLoading(false);
    };

    loadFromStorage();

    const handleAuthChange = () => {
      loadFromStorage();
    };

    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user
  };
};

// (dev auto-create handled inline in this file)
