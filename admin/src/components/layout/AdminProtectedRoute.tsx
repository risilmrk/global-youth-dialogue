import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gyde-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Authenticating Administrator Clearance...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};
