// src/router.tsx
import React, { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreatePayment from './components/payments/CreatePayment';
import TransactionList from './components/payments/TransactionList';
import PaymentStatus from './components/payments/PaymentStatus';
import SchoolTransactions from './components/payments/SchoolTransactions';
import TransactionStatusCheck from './components/payments/TransactionStatusCheck';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

// Auth guard for protected routes
const ProtectedRoute = ({ children }: { children: ReactNode }): React.ReactElement => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <TransactionList />
      },
      {
        path: '/dashboard/create-payment',
        element: <CreatePayment />
      },
      {
        path: 'transactions',
        element: <TransactionStatusCheck />
      },
      {
        path: 'transaction/:id',
        element: <PaymentStatus />
      },
      {
        path: 'school-transactions',
        element: <SchoolTransactions />
      },
      {
        path: 'school-transactions/:schoolId',
        element: <SchoolTransactions />
      },
      {
        path: 'check-status',
        element: <TransactionStatusCheck />
      }
    ]
  }
]);