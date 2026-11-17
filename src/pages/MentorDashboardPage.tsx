import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorApi, MentorDashboardData } from '../api/mentor';

// Localized date formatter (e.g., "4 Nov 2026")
function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export const MentorDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) return;

    mentorApi
      .getDashboardData(currentUser.id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load mentor dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser]);

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-smp-navy border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-smp-muted font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const { mentees, meetLogs, checkpointsRequired } = data;
  const completedCount = meetLogs.length;
  const progressPct = Math.min((completedCount / checkpointsRequired) * 100, 100);
  const remaining = Math.max(checkpointsRequired - completedCount, 0);

  // Helper map for fast lookup of mentee names from IDs
  const menteeMap = new Map(mentees.map((m) => [m.id, m.name]));

  return (
    <div className="space-y-6">
      
      {/* 1. Mentor Welcome Header Card */}
      <div className="bg-smp-card p-5 sm:p-6 rounded-2xl border border-smp-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-smp-brown">
            Mentor Workspace
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-smp-navy mt-0.5">
            Welcome, {currentUser?.name || 'Mentor'}
          </h1>
          <p className="text-xs text-smp-muted mt-1">
            Cohort 2026-2027 &bull; {mentees.length} Mentees Assigned
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          <Link
            to="/meets/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer text-center"
          >
            <span>+ Log New Meet</span>
          </Link>
          <Link
            to="/mentees/setup"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 text-smp-brown border border-amber-300/80 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
          >
            <span>Edit Mentees</span>
          </Link>
        </div>
      </div>

      {/* 2. Checkpoint Progress Tracker Card */}
      <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-smp-navy uppercase tracking-wider">
              Checkpoint Progress
            </span>
          </div>
          <span className="text-xs font-semibold text-smp-brown bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            {completedCount} of {checkpointsRequired} completed
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-amber-100/60 h-2.5 rounded-full overflow-hidden border border-amber-200/80 mb-2">
          <div
            className="bg-smp-navy h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Status text */}
        <p className="text-xs text-smp-muted">
          {remaining === 0 ? (
            <span className="text-green-700 font-semibold">
              All required checkpoints completed! Great job supporting your mentees.
            </span>
          ) : (
            <span>
              <strong className="text-smp-brown font-semibold">{remaining} more meet{remaining > 1 ? 's' : ''}</strong> needed to fulfill your tenure checkpoint requirements.
            </span>
          )}
        </p>
      </div>

      {/* 3. Assigned Mentee Chips Preview */}
      {mentees.length > 0 && (
        <div className="bg-smp-card p-5 rounded-2xl border border-smp-border shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-smp-navy uppercase tracking-wider">
              Assigned Mentees ({mentees.length})
            </span>
            <Link
              to="/mentees/setup"
              className="text-xs text-smp-brown font-semibold hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentees.map((mentee) => (
              <span
                key={mentee.id}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-amber-50 text-smp-text border border-amber-200/80 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {mentee.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Past Meets History Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-smp-navy uppercase tracking-wider">
            Past Meets History ({meetLogs.length})
          </h2>
          <span className="text-xs text-smp-muted">Sorted latest first</span>
        </div>

        {meetLogs.length === 0 ? (
          <div className="bg-smp-card p-8 rounded-2xl border border-dashed border-smp-border text-center">
            <p className="text-xs text-smp-muted mb-3">
              No meets logged yet. Click below to submit your first checkpoint meet!
            </p>
            <Link
              to="/meets/new"
              className="inline-block px-4 py-2 rounded-xl bg-smp-navy text-white text-xs font-semibold hover:bg-smp-navy-hover transition-colors"
            >
              + Log Meet #1
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {meetLogs.map((meet, index) => {
              // Calculate meet order index (e.g. Meet #4, Meet #3...)
              const meetNumber = completedCount - index;

              return (
                <div
                  key={meet.id}
                  className="bg-smp-card p-4 sm:p-5 rounded-2xl border border-smp-border shadow-xs hover:border-amber-300/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-smp-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        #{meetNumber}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-smp-navy">
                          Meet on {formatDate(meet.date)}
                        </div>
                        <div className="text-[11px] text-smp-muted">
                          {meet.attendedMenteeIds.length} mentees attended
                        </div>
                      </div>
                    </div>

                    {/* Selfie proof thumbnail (larger, clickable zoom) */}
                    {meet.selfieUrl && (
                      <div className="relative group flex-shrink-0">
                        <img
                          src={meet.selfieUrl}
                          alt="Meet selfie verification"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-smp-border shadow-2xs group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary of the session */}
                  <p className="text-xs sm:text-sm text-smp-text leading-relaxed mb-3 bg-amber-50/30 p-3 rounded-xl border border-amber-100/60">
                    {meet.summary}
                  </p>

                  {/* Attended mentees tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-smp-border/60">
                    <span className="text-[10px] font-bold uppercase text-smp-muted mr-1">
                      Present:
                    </span>
                    {meet.attendedMenteeIds.map((id) => (
                      <span
                        key={id}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-100/60 text-smp-brown"
                      >
                        {menteeMap.get(id) || id}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
