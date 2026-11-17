import React from 'react';
import { Link } from 'react-router-dom';

export const MentorDashboardPage: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Mentor Welcome Card */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-smp-brown">Mentor Workspace</span>
          <h1 className="text-xl font-bold text-smp-navy mt-0.5">Welcome, Tanmay</h1>
          <p className="text-xs text-smp-muted mt-1">Cohort 2026-2027 &bull; 6 Mentees Assigned</p>
        </div>
        <Link
          to="/meets/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          + Log New Meet
        </Link>
      </div>

      {/* Checkpoint Progress Card */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-smp-navy uppercase tracking-wider">Checkpoint Progress</span>
          </div>
          <span className="text-xs font-semibold text-smp-brown bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300/80">
            4 of 6 meets completed
          </span>
        </div>
        {/* Subtle, elegant track & bar */}
        <div className="w-full bg-amber-100/60 h-2.5 rounded-full overflow-hidden border border-amber-200/80">
          <div className="bg-smp-navy h-full rounded-full transition-all" style={{ width: '66.6%' }}></div>
        </div>
      </div>

      {/* Quick Action Navigation Shell */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/mentees/setup"
          className="p-4 rounded-xl bg-smp-card hover:bg-amber-50/30 border border-smp-border transition-colors block text-left"
        >
          <div className="text-xs font-bold text-smp-navy">Mentee List Setup</div>
          <p className="text-[11px] text-smp-muted mt-1">Configure your assigned mentees</p>
        </Link>
        <Link
          to="/meets/new"
          className="p-4 rounded-xl bg-smp-card hover:bg-amber-50/30 border border-smp-border transition-colors block text-left"
        >
          <div className="text-xs font-bold text-smp-navy">Submit Meet Log</div>
          <p className="text-[11px] text-smp-muted mt-1">Upload selfie & notes</p>
        </Link>
      </div>

      {/* Past Meets Placeholder */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border">
        <h2 className="text-sm font-bold text-smp-navy mb-3">Past Meets History</h2>
        <div className="text-xs text-smp-muted py-6 text-center border border-dashed border-smp-border rounded-xl">
          Meet log history cards will be connected with mock data in Stage 1.
        </div>
      </div>
    </div>
  );
};
