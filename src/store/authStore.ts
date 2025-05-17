import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;  // ← added
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (user: any | null) => void;  // ← added
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  getUser: () => Promise<{ user: any | null; error: string | null }>;  // ← added
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,  // ← added

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user }),  // ← added

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      set({ isAuthenticated: true, user: data.user });
    }
    return { error: error ? error.message : null };
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error) {
      set({ isAuthenticated: true, user: data.user });
    }
    return { error: error ? error.message : null };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      set({ isAuthenticated: false, user: null });
    }
    return { error: error ? error.message : null };
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      set({ user: data.user });

    }
    return { user: data.user, error: error ? error.message : null };
  },
}));