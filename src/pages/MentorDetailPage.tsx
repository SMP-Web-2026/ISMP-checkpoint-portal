import React from 'react';
import { Link, useParams } from 'react-router-dom';

export const MentorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/admin" className="text-smp-navy hover:underline">Admin Roster</Link>
        <span>&rsaquo;</span>
        <span>Mentor Detail ({id || 'm1'})</span>
      </div>

      <div className="bg-smp-card p-5 sm:p-6 rounded-2xl border border-smp-border shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg font-bold text-smp-navy">Mentor Detail & Meet Logs</h1>
            <p className="text-xs text-smp-muted mt-0.5">Full compliance log and AI inspection breakdown</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-smp-brown font-semibold border border-amber-300">
            SMPC Review View
          </span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-smp-brown mb-5">
          Stage 0 Shell: In Stage 1, this view will show meet selfies, per-mentee notes, AI confidence scores, and action buttons to mark &quot;Reviewed: not AI&quot; or &quot;Reviewed: confirmed&quot;.
        </div>

        <Link
          to="/admin"
          className="inline-block px-4 py-2 rounded-xl bg-smp-navy text-white text-xs font-semibold hover:bg-smp-navy-hover transition-colors"
        >
          &larr; Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};
