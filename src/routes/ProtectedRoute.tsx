"use client"

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
  
    return children ? <>{children}</> : <Outlet />;
  }