import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminProtectedRoute } from './components/layout/AdminProtectedRoute';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { Users } from './pages/Users';
import { Sessions } from './pages/Sessions';
import { Topics } from './pages/Topics';
import { Feedback } from './pages/Feedback';
import { Publications } from './pages/Publications';
import { Analytics } from './pages/Analytics';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="applications" element={<Applications />} />
              <Route path="users" element={<Users />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="topics/pipeline" element={<Topics />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="publications" element={<Publications />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
