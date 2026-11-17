import React from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Admin Header */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-smp-brown">SMPC Oversight</span>
          <h1 className="text-xl font-bold text-smp-navy mt-0.5">Admin Compliance Overview</h1>
          <p className="text-xs text-smp-muted mt-1">Reviewing 150 ISMP Mentors &bull; Checkpoint Target: 6 meets</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-smp-brown font-semibold border border-amber-300">
            2 Flags Pending Review
          </span>
        </div>
      </div>

      {/* Mentor Roster Overview Table Placeholder */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-smp-navy">Mentor Compliance Roster</h2>
          <span className="text-xs text-smp-muted">Search & Sort</span>
        </div>

        {/* Demo row linking to detail view */}
        <div className="border border-smp-border rounded-xl divide-y divide-smp-border">
          <div className="p-3.5 flex items-center justify-between hover:bg-amber-50/20 transition-colors">
            <div>
              <div className="text-xs font-bold text-smp-navy">Tanmay Sonkar (Demo ISMP)</div>
              <div className="text-[11px] text-smp-muted">4 of 6 meets completed &bull; 1 selfie flagged</div>
            </div>
            <Link
              to="/admin/mentor/m1"
              className="px-3 py-1.5 rounded-lg bg-smp-navy text-white text-xs font-semibold hover:bg-smp-navy-hover transition-colors"
            >
              View History &rarr;
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-smp-muted mt-4 text-center">
          Full searchable, filterable table will be connected to mock data in Stage 1.
        </p>
      </div>
    </div>
  );
};
