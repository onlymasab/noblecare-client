import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner'; // or your preferred toast lib

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      toast.error(`Session error: ${error.message}`);
    } else {
      setUser(data.session?.user || null);
      toast.success('Session loaded');
    }
  };

  getSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user || null);
    if (event === 'SIGNED_IN') {
      toast.success('Signed in successfully!');
    } else if (event === 'SIGNED_OUT') {
      toast('Signed out');
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}, [setUser]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign-in error:', error);
      toast.error(`Sign-in failed: ${error.message}`);
      throw error;
    }
    toast.success('Signed in!');
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign-up error:', error);
      toast.error(`Sign-up failed: ${error.message}`);
      throw error;
    }
    toast.success('Sign-up successful! Check your email.');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error);
      toast.error(`Sign-out failed: ${error.message}`);
      throw error;
    }
    setUser(null);
    toast.success('Signed out');
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      toast.error(`Fetch profile failed: ${error.message}`);
      return null;
    }
    return data.user;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, signOut, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};