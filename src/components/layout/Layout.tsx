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

  return (
    <div className="min-h-screen flex flex-col bg-smp-bg text-smp-text">
      {showNavbar && <Navbar />}

      {/* 
        Responsive container width:
        - Wide desktop width (max-w-6xl / max-w-7xl) across all dashboard & content pages
        - Keeps phone-friendly compact view naturally on mobile
      */}
      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 transition-all ${
          location.pathname === '/login' ? 'max-w-md' : 'max-w-6xl'
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
