import React from 'react';
import { Link } from 'react-router-dom';

export const MenteeSetupPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/" className="text-smp-navy hover:underline">Dashboard</Link>
        <span>&rsaquo;</span>
        <span>Mentee List Setup</span>
      </div>

      <div className="bg-smp-card p-5 sm:p-6 rounded-2xl border border-smp-border shadow-sm">
        <h1 className="text-lg font-bold text-smp-navy">Mentee List Setup</h1>
        <p className="text-xs text-smp-muted mt-1 mb-5">
          Enter the 5 to 8 mentees assigned to you. Entering them once keeps future meet logs consistent.
        </p>

        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-smp-brown mb-5">
          Stage 0 Shell: In Stage 1, this form will allow dynamic adding, editing, and saving of mentee names to mock storage.
        </div>

        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl bg-smp-navy text-white text-xs font-semibold hover:bg-smp-navy-hover transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
