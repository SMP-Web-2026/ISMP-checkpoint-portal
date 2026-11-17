import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-smp-bg text-smp-text">
      {showNavbar && <Navbar />}

      {/* Centered mobile-first container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 sm:py-6">
        {children}
      </main>

      {/* Subtle academic footer */}
      <footer className="w-full border-t border-smp-border py-4 text-center text-xs text-smp-muted">
        Student Mentor Program &bull; Academic Evaluation Portal
      </footer>
    </div>
  );
};
