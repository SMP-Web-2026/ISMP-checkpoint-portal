import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
}) => {
  const location = useLocation();

  const isAdminView = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-smp-bg text-smp-text">
      {showNavbar && <Navbar />}

      {/* 
        Responsive container width:
        - Admin views: max-w-6xl on desktop for spacious table & data viewing
        - Mentor views & forms: max-w-2xl on desktop for focused, clean, compact card layouts
        - Login: max-w-md
      */}
      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 transition-all ${
          location.pathname === '/login'
            ? 'max-w-md'
            : isAdminView
            ? 'max-w-6xl lg:px-8'
            : 'max-w-2xl'
        }`}
      >
        {children}
      </main>

      {/* Subtle academic footer */}
      <footer className="w-full border-t border-smp-border py-4 text-center text-xs text-smp-muted">
        Student Mentor Program &bull; Academic Evaluation Portal
      </footer>
    </div>
  );
};
