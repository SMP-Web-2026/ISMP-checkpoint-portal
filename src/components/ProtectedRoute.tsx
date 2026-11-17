import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-smp-muted font-medium">
        Loading session...
      </div>
    );
  }

  if (!currentUser) {
    // Redirect unauthenticated visitors to login, preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection: mentors can't access admin routes, and vice-versa
  if (allowedRole && currentUser.role !== allowedRole) {
    const redirectPath = currentUser.role === 'smpc_admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
