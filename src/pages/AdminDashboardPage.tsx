import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, AdminDashboardData } from '../api/admin';
import { MentorRosterItem } from '../mock/mentorsList';

type SortKey = 'name' | 'completed' | 'flag';
type SortDir = 'asc' | 'desc';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    adminApi
      .getDashboardData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load admin dashboard:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-smp-navy border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-smp-muted font-medium">Loading SMPC compliance overview...</p>
      </div>
    );
  }

  const { roster, totalMentors, avgCompleted, flaggedCount } = data;

  // Filter by search query (name, email, department)
  const filtered = roster.filter((m) => {
    const q = search.toLowerCase().trim();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    );
  });

  // Sort rows
  const sorted: MentorRosterItem[] = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortKey === 'completed') {
      cmp = a.completedMeets - b.completedMeets;
    } else if (sortKey === 'flag') {
      cmp = (a.hasFlaggedSelfie ? 1 : 0) - (b.hasFlaggedSelfie ? 1 : 0);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIndicator = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <span className="opacity-40 ml-1">&#8597;</span>;
    return <span className="ml-1 text-amber-300 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Card */}
      <div className="bg-smp-card p-5 sm:p-6 rounded-3xl border border-smp-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-smp-brown">
            SMPC Oversight Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-smp-navy mt-0.5">
            Mentor Compliance Overview
          </h1>
          <p className="text-xs text-smp-muted mt-1">
            Tracking checkpoint meets and AI selfie verification across all cohorts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-smp-brown font-semibold border border-amber-300">
            Target: 6 Checkpoint Meets
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-smp-card p-4 sm:p-5 rounded-2xl border border-smp-border shadow-xs">
          <span className="text-[11px] font-bold uppercase text-smp-muted">
            Total Mentors
          </span>
          <div className="text-2xl font-extrabold text-smp-navy mt-1">
            {totalMentors}
          </div>
          <p className="text-[11px] text-smp-muted mt-0.5">Enrolled for 2026-27 tenure</p>
        </div>

        <div className="bg-smp-card p-4 sm:p-5 rounded-2xl border border-smp-border shadow-xs">
          <span className="text-[11px] font-bold uppercase text-smp-muted">
            Average Checkpoints
          </span>
          <div className="text-2xl font-extrabold text-smp-brown mt-1">
            {avgCompleted} <span className="text-xs font-normal text-smp-muted">/ 6 meets</span>
          </div>
          <p className="text-[11px] text-smp-muted mt-0.5">Cohort-wide completion pace</p>
        </div>

        <div className="bg-smp-card p-4 sm:p-5 rounded-2xl border border-smp-border shadow-xs">
          <span className="text-[11px] font-bold uppercase text-smp-muted">
            AI Flags Pending Review
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 flex items-center gap-2">
            <span>{flaggedCount}</span>
            {flaggedCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-smp-muted mt-0.5">Awaiting human coordinator check</p>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-smp-card p-4 rounded-2xl border border-smp-border shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by mentor name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-smp-border bg-amber-50/20 text-smp-text focus:outline-none focus:ring-2 focus:ring-smp-navy focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-xs text-smp-muted">🔍</span>
        </div>
        <div className="text-xs text-smp-muted self-end sm:self-auto font-medium">
          Showing {sorted.length} of {totalMentors} mentors
        </div>
      </div>

      {/* 4. Mentor Compliance Table */}
      <div className="bg-smp-card rounded-3xl border border-smp-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-smp-navy text-white text-[11px] uppercase tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 font-bold cursor-pointer hover:bg-smp-navy-hover transition-colors"
                >
                  Mentor Name & Email <SortIndicator k="name" />
                </th>
                <th className="py-3.5 px-3 font-bold hidden sm:table-cell">
                  Dept
                </th>
                <th className="py-3.5 px-3 font-bold">
                  Mentees
                </th>
                <th
                  onClick={() => handleSort('completed')}
                  className="py-3.5 px-4 font-bold cursor-pointer hover:bg-smp-navy-hover transition-colors"
                >
                  Progress <SortIndicator k="completed" />
                </th>
                <th
                  onClick={() => handleSort('flag')}
                  className="py-3.5 px-3 font-bold cursor-pointer hover:bg-smp-navy-hover transition-colors"
                >
                  AI Flag <SortIndicator k="flag" />
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-smp-border/70">
              {sorted.map((mentor) => {
                const pct = Math.min((mentor.completedMeets / mentor.checkpointsRequired) * 100, 100);

                return (
                  <tr
                    key={mentor.id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    {/* Mentor Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-smp-navy text-xs sm:text-sm">
                        {mentor.name}
                      </div>
                      <div className="text-[11px] text-smp-muted">
                        {mentor.email}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-3 hidden sm:table-cell text-smp-text font-medium">
                      {mentor.department}
                    </td>

                    {/* Mentee Count */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/70 text-smp-brown font-semibold text-[11px]">
                        {mentor.menteeCount}
                      </span>
                    </td>

                    {/* Progress Bar & Ratio */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 bg-amber-100 h-2 rounded-full overflow-hidden border border-amber-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 100 ? 'bg-emerald-600' : 'bg-smp-navy'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-bold text-smp-navy text-[11px]">
                          {mentor.completedMeets}/{mentor.checkpointsRequired}
                        </span>
                      </div>
                    </td>

                    {/* AI Flag Indicator */}
                    <td className="py-3.5 px-3">
                      {mentor.hasFlaggedSelfie ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                          <span>⚠️</span> Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                          <span>✓</span> Clear
                        </span>
                      )}
                    </td>

                    {/* View Details Link */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/mentor/${mentor.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-[11px] font-semibold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                      >
                        View History &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-smp-muted">
                    No mentors found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
