import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { MenteeSetupPage } from './pages/MenteeSetupPage';
import { NewMeetLogPage } from './pages/NewMeetLogPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MentorDetailPage } from './pages/MentorDetailPage';

export const App: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  return (
    <Layout
      userRole={isAdmin ? 'smpc_admin' : 'mentor'}
      userName={isAdmin ? 'SMPC Admin' : 'Tanmay (Demo Mentor)'}
      showNavbar={!isLoginPage}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MentorDashboardPage />} />
        <Route path="/mentees/setup" element={<MenteeSetupPage />} />
        <Route path="/meets/new" element={<NewMeetLogPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/mentor/:id" element={<MentorDetailPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
