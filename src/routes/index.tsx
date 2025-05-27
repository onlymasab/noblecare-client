import { RouteObject } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // this is the default route for "/"
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
];