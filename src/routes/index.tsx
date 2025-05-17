import MainLayout from '@/layouts/MainLayout';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/AuthPage';

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
        index: true,
        element: <DashboardPage />,
      },
      // Add more protected child routes here
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
];