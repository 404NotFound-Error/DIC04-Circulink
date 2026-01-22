interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser;
  tokens: AuthTokens;
}

const AUTH_STORAGE_KEY = 'circulink.auth';
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000';

const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:change'));
  }
};

const saveAuthState = (state: AuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  emitAuthChange();
};

const clearAuthState = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
};

export const getAuthState = (): AuthState | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.error?.message || data?.message || response.statusText;
  } catch {
    return response.statusText;
  }
};

const requestJson = async <T>(path: string, options: RequestInit) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

export const signIn = async (email: string, password: string) => {
  const data = await requestJson<{
    user: AuthUser;
    tokens: AuthTokens;
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  saveAuthState({ user: data.user, tokens: data.tokens });
  return data;
};

export const signUp = async (email: string, password: string, userData?: { name?: string }) => {
  const data = await requestJson<{
    user: AuthUser;
    tokens: AuthTokens;
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      name: userData?.name
    })
  });

  saveAuthState({ user: data.user, tokens: data.tokens });
  return data;
};

export const refreshSession = async () => {
  const state = getAuthState();
  if (!state?.tokens?.refreshToken) {
    throw new Error('Missing refresh token');
  }

  const data = await requestJson<{ tokens: AuthTokens }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: state.tokens.refreshToken })
  });

  saveAuthState({ user: state.user, tokens: data.tokens });
  return data;
};

export const signOut = async () => {
  const state = getAuthState();
  if (state?.tokens?.refreshToken) {
    try {
      await requestJson<void>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: state.tokens.refreshToken })
      });
    } catch {
      // Ignore logout errors; local state will be cleared.
    }
  }

  clearAuthState();
};

