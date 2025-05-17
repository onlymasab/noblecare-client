"use client"

import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/routes/index';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

function AppRoutes() {
  return useRoutes(routes);
}

function App() {

  useEffect(() => {
    const { setIsAuthenticated, setIsLoading, setUser } = useAuthStore.getState();

    const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
            setIsAuthenticated(!!session);
            if (session) {
                const { data } = await supabase.auth.getUser();
                setUser(data.user);
            } else {
                setUser(null);
            }
        }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
        setIsAuthenticated(!!session);
        if (session) {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        } else {
            setUser(null);
        }
        setIsLoading(false);
    });

    return () => {
        authListener?.subscription.unsubscribe();
    };
}, []);
  

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;



/*

const { isLoading, setIsAuthenticated, setIsLoading } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);  // <- loading done!
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setIsLoading]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }



*/