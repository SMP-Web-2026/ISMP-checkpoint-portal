import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { MenteeSetupPage } from './pages/MenteeSetupPage';
import { NewMeetLogPage } from './pages/NewMeetLogPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MentorDetailPage } from './pages/MentorDetailPage';

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Layout showNavbar={!isLoginPage}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Mentor Routes (Never accessible to smpc_admin) */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="mentor">
              <MentorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentees/setup"
          element={
            <ProtectedRoute allowedRole="mentor">
              <MenteeSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meets/new"
          element={
            <ProtectedRoute allowedRole="mentor">
              <NewMeetLogPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes (Never accessible to mentor) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="smpc_admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mentor/:id"
          element={
            <ProtectedRoute allowedRole="smpc_admin">
              <MentorDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
