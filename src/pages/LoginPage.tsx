import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-12">
      <div className="w-full max-w-sm bg-smp-card p-6 sm:p-8 rounded-2xl shadow-sm border border-smp-border text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-smp-brown font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-amber-300">
          SMP
        </div>
        <h1 className="text-xl font-bold text-smp-navy mb-1">ISMP Checkpoint Portal</h1>
        <p className="text-xs text-smp-muted mb-6">Sign in to log and review mentorship meets</p>

        {/* Demo Fast Login Switcher (Placeholder) */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full block py-2.5 px-4 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Demo Login as ISMP Mentor
          </Link>
          <Link
            to="/admin"
            className="w-full block py-2.5 px-4 rounded-xl bg-smp-card hover:bg-amber-50/50 text-smp-brown border border-smp-border text-sm font-semibold transition-colors"
          >
            Demo Login as SMPC Admin
          </Link>
        </div>

        <p className="text-[11px] text-smp-muted mt-6">
          Stage 0 Scaffold Shell &bull; Stage 1 will implement actual mock authentication.
        </p>
      </div>
    </div>
  );
};
