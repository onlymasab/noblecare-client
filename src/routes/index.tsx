import { RouteObject } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import AppointmentPage from '@/pages/AppointmentPage';
import PatientsPage from '@/pages/PatientsPage';
import StaffPage from '@/pages/StaffPage';
import MessagesPage from '@/pages/MessagesPage';
import ReviewsPage from '@/pages/ReviewsPage';
import FinancePage from '@/pages/FinancePage';

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
      {
        path: "appointment", // this is the default route for "/"
        element: <AppointmentPage />,
      },
      {
        path: "patient", // this is the default route for "/"
        element: <PatientsPage />,
      },
      {
        path: "staff", // this is the default route for "/"
        element: <StaffPage />,
      },
      {
        path: "message", // this is the default route for "/"
        element: <MessagesPage />,
      },
      {
        path: "review", // this is the default route for "/"
        element: <ReviewsPage />,
      },
      {
        path: "finance", // this is the default route for "/"
        element: <FinancePage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
];