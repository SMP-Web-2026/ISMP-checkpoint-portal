import React from 'react';
import { Link } from 'react-router-dom';

export const NewMeetLogPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/" className="text-smp-navy hover:underline">Dashboard</Link>
        <span>&rsaquo;</span>
        <span>Log New Meet</span>
      </div>

      <div className="bg-smp-card p-5 sm:p-6 rounded-2xl border border-smp-border shadow-sm">
        <h1 className="text-lg font-bold text-smp-navy">Log New Meet</h1>
        <p className="text-xs text-smp-muted mt-1 mb-5">
          Multi-step meet submission: selfie proof, attendance, and notes.
        </p>

        {/* Step indicator preview */}
        <div className="flex items-center justify-between text-xs font-semibold mb-6 pb-3 border-b border-smp-border">
          <span className="text-smp-navy">1. Selfie</span>
          <span className="text-smp-muted">2. Attendance</span>
          <span className="text-smp-muted">3. Notes</span>
          <span className="text-smp-muted">4. Review</span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-smp-brown mb-5">
          Stage 0 Shell: The multi-step form wizard (selfie upload, mentee selection, per-mentee notes) will be built in Stage 1.
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
