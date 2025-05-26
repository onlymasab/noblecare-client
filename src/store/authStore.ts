import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: AuthError | string | null;
  cancelled: boolean;
  lastAction: 'signIn' | 'signUp' | 'signOut' | 'fetchUser' | null;

  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setError: (error: AuthError | string | null) => void;
  setCancelled: (value: boolean) => void;
  reset: () => void;

  signInOrSignUpFlow: (
    email: string,
    password: string,
    promptForName: () => Promise<string | null>
  ) => Promise<void>;

  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const initialState: Pick<
  AuthState,
  'isAuthenticated' | 'isLoading' | 'user' | 'error' | 'cancelled' | 'lastAction'
> = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  cancelled: false,
  lastAction: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  setCancelled: (value) => set({ cancelled: value }),
  reset: () => set({ ...initialState }),

  signInOrSignUpFlow: async (email, password, promptForName) => {
    if (!email || !password) {
      set({
        error: 'Email and password are required',
        isLoading: false,
        lastAction: 'signIn',
        cancelled: false,
      });
      return;
    }

    set({
      isLoading: true,
      error: null,
      cancelled: false,
      lastAction: 'signIn',
    });

    try {
      // Try to sign in first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        // Successful sign-in
        set({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
          lastAction: 'signIn',
          cancelled: false,
          error: null,
        });
        return;
      }

      // If error due to invalid login credentials, prompt for sign-up
      if (error?.message.includes('Invalid login credentials')) {
        set({ lastAction: 'signUp', cancelled: false });

        // Ask user for their name in a dialog (the promptForName function)
        const name = await promptForName();

        if (!name) {
          // User cancelled sign-up dialog
          set({
            error: 'Sign up cancelled by user',
            isAuthenticated: false,
            user: null,
            isLoading: false,
            lastAction: 'signUp',
            cancelled: true,
          });
          return;
        }

        // Sign up the new user with the provided name
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }, // Store name in user metadata
          },
        });

        if (signUpError) {
          // Sign up error
          set({
            error: signUpError.message || signUpError,
            isAuthenticated: false,
            user: null,
            isLoading: false,
            lastAction: 'signUp',
            cancelled: false,
          });
          return;
        }

        // Sign-up success, user record created, but session may need confirmation (email confirmation depending on Supabase settings)
        set({
          isAuthenticated: true,
          user: signUpData.user,
          isLoading: false,
          lastAction: 'signUp',
          cancelled: false,
          error: null,
        });
        return;
      }

      // Other errors during sign-in
      set({
        error: error?.message || error || 'An unknown error occurred during sign in',
        isAuthenticated: false,
        user: null,
        isLoading: false,
        lastAction: 'signIn',
        cancelled: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
        isAuthenticated: false,
        user: null,
        isLoading: false,
        lastAction: 'signIn',
        cancelled: false,
      });
    }
  },

  signOut: async () => {
    set({
      isLoading: true,
      error: null,
      cancelled: false,
      lastAction: 'signOut',
    });

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        set({
          error: error.message || error,
          isLoading: false,
          lastAction: 'signOut',
          cancelled: false,
        });
      } else {
        set({
          ...initialState,
          lastAction: 'signOut',
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
        isLoading: false,
        lastAction: 'signOut',
        cancelled: false,
      });
    }
  },

  fetchUser: async () => {
    set({
      isLoading: true,
      error: null,
      cancelled: false,
      lastAction: 'fetchUser',
    });

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        set({
          error: error.message || error,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastAction: 'fetchUser',
          cancelled: false,
        });
        return;
      }

      if (data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          lastAction: 'fetchUser',
          cancelled: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastAction: 'fetchUser',
          cancelled: false,
          error: null,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastAction: 'fetchUser',
        cancelled: false,
      });
    }
  },
}));