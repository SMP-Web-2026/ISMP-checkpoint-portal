import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorApi, MentorDashboardData, MentorSafeMeetLog } from '../api/mentor';
import { meetsApi } from '../api/meets';

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

  // Lightbox / Detail preview state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Edit Meet Modal State
  const [editingMeet, setEditingMeet] = useState<MentorSafeMeetLog | null>(null);
  const [editSummary, setEditSummary] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  // Notification state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadDashboard = () => {
    if (!currentUser) return;
    mentorApi
      .getDashboardData(currentUser.id)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, [currentUser]);

  // Handle Delete
  const handleDeleteMeet = async (meetId: string, meetNum: number) => {
    if (!window.confirm(`Are you sure you want to delete Meet #${meetNum}? This will remove it from your completed checkpoints.`)) {
      return;
    }
    await meetsApi.deleteMeetLog(meetId);
    showToast(`Meet #${meetNum} deleted successfully.`);
    loadDashboard();
  };

  // Open Edit Modal
  const openEditModal = (meet: MentorSafeMeetLog) => {
    setEditingMeet(meet);
    setEditSummary(meet.summary);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeet || !editSummary.trim()) return;

    setSavingEdit(true);
    await meetsApi.updateMeetLog(editingMeet.id, {
      summary: editSummary.trim(),
    });
    setSavingEdit(false);
    setEditingMeet(null);
    showToast('Meet details updated successfully.');
    loadDashboard();
  };

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

  const menteeMap = new Map(mentees.map((m) => [m.id, m.name]));

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-xs">
          <span>&#10003; {toast}</span>
          <button onClick={() => setToast(null)} className="font-bold">&times;</button>
        </div>
      )}

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

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            to="/meets/new"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            + Log New Meet
          </Link>
          <Link
            to="/mentees/setup"
            className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-smp-brown border border-amber-300 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            Edit Mentees
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

        <p className="text-xs text-smp-muted">
          {remaining === 0 ? (
            <span className="text-emerald-700 font-semibold">
              All required checkpoints completed! Great job supporting your mentees.
            </span>
          ) : (
            <span>
              <strong className="text-smp-brown font-semibold">{remaining} more meet{remaining > 1 ? 's' : ''}</strong> needed to fulfill your tenure checkpoint requirements.
            </span>
          )}
        </p>
      </div>

      {/* 3. Assigned Mentee Chips */}
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

      {/* 4. Past Meets History Feed with Edit, Delete & Photo Zoom */}
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
          <div className="space-y-3.5">
            {meetLogs.map((meet, index) => {
              const meetNumber = completedCount - index;

              return (
                <div
                  key={meet.id}
                  className="bg-smp-card p-4 sm:p-5 rounded-2xl border border-smp-border shadow-xs transition-all"
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

                    {/* Selfie proof with click-to-zoom */}
                    {meet.selfieUrl && (
                      <div
                        onClick={() => setSelectedPhoto(meet.selfieUrl)}
                        className="relative group flex-shrink-0 cursor-pointer"
                        title="Click to view full photo"
                      >
                        <img
                          src={meet.selfieUrl}
                          alt="Meet selfie"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-smp-border shadow-2xs group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                          🔍
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-smp-text leading-relaxed mb-3 bg-amber-50/20 p-3 rounded-xl border border-amber-100">
                    {meet.summary}
                  </p>

                  {/* Attended mentees tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-smp-border/60">
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

                  {/* Per-mentee notes if any */}
                  {meet.menteeNotes && meet.menteeNotes.length > 0 && (
                    <div className="py-2 space-y-1 text-xs">
                      {meet.menteeNotes.map((n, i) => (
                        <div key={i} className="text-[11px] text-smp-muted">
                          <strong className="text-smp-navy">{menteeMap.get(n.menteeId) || n.menteeId}:</strong> {n.note}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Meet Controls: Edit & Delete */}
                  <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => openEditModal(meet)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-smp-brown hover:bg-amber-100 border border-amber-200 font-semibold transition-colors cursor-pointer"
                    >
                      ✏️ Edit Summary
                    </button>
                    <button
                      onClick={() => handleDeleteMeet(meet.id, meetNumber)}
                      className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold transition-colors cursor-pointer"
                    >
                      🗑️ Delete Meet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Meet Modal */}
      {editingMeet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-smp-card w-full max-w-lg p-6 rounded-3xl border border-smp-border shadow-xl">
            <h3 className="text-base font-bold text-smp-navy mb-1">
              Edit Meet Summary
            </h3>
            <p className="text-xs text-smp-muted mb-4">
              Update the notes or discussion topics for this session.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <textarea
                rows={4}
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-smp-border bg-white text-xs sm:text-sm text-smp-text focus:outline-none focus:ring-2 focus:ring-smp-navy leading-relaxed"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMeet(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-smp-muted hover:text-smp-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || !editSummary.trim()}
                  className="px-5 py-2 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-smp-card p-2 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={selectedPhoto}
              alt="Meet selfie expanded"
              className="max-w-full max-h-[75vh] rounded-2xl object-contain mx-auto"
            />
            <div className="p-3 text-center text-xs font-semibold text-smp-navy flex justify-between items-center">
              <span>Meet Photo Verification</span>
              <span className="text-smp-muted font-normal">(Click anywhere to close)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
