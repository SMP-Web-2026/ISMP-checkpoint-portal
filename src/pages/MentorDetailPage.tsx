import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { MeetLog } from '../types';
import { MentorRosterItem } from '../mock/mentorsList';

export const MentorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mentorId = id || 'mentor_tanmay';

  const [mentor, setMentor] = useState<MentorRosterItem | null>(null);
  const [meets, setMeets] = useState<MeetLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const loadData = () => {
    adminApi
      .getMentorDetail(mentorId)
      .then((res) => {
        setMentor(res.mentor);
        setMeets(res.meets);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [mentorId]);

  const handleReview = async (meetId: string, resolution: 'not_ai' | 'confirmed') => {
    await adminApi.reviewFlag(meetId, resolution);
    setReviewMessage(
      resolution === 'not_ai'
        ? 'Flag dismissed: Marked as "Reviewed: Not AI"'
        : 'Flag confirmed: Marked as "Reviewed: Confirmed AI Flag"'
    );
    loadData();
    setTimeout(() => setReviewMessage(null), 3000);
  };

  if (loading || !mentor) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-smp-navy border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-smp-muted font-medium">Loading mentor review history...</p>
      </div>
    );
  }

  const completed = meets.length;
  const required = mentor.checkpointsRequired || 6;
  const pct = Math.min((completed / required) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/admin" className="text-smp-navy hover:underline font-semibold">
          &larr; Admin Roster
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-smp-text">{mentor.name}</span>
      </div>

      {reviewMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-2xs">
          <span>&#10003; {reviewMessage}</span>
          <button onClick={() => setReviewMessage(null)} className="text-emerald-900 font-bold">&times;</button>
        </div>
      )}

      {/* Mentor Profile & Progress Header */}
      <div className="bg-smp-card p-6 sm:p-7 rounded-3xl border border-smp-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-smp-brown">
              Mentor Detail & Evaluation
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-smp-brown font-semibold border border-amber-300">
              {mentor.department}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-smp-navy">
            {mentor.name}
          </h1>
          <p className="text-xs text-smp-muted mt-1">
            {mentor.email} &bull; {mentor.menteeCount} Assigned Mentees
          </p>
        </div>

        {/* Progress Metric Box */}
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-smp-border/80 min-w-[200px]">
          <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-smp-navy">
            <span>Progress</span>
            <span>{completed} of {required} meets</span>
          </div>
          <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden border border-amber-200">
            <div
              className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-600' : 'bg-smp-navy'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meets Log History Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-smp-navy uppercase tracking-wider">
            Checkpoint Meet Logs ({meets.length})
          </h2>
          <span className="text-xs text-smp-muted">Showing selfies & AI confidence scores</span>
        </div>

        {meets.length === 0 ? (
          <div className="bg-smp-card p-10 rounded-3xl border border-dashed border-smp-border text-center text-xs text-smp-muted">
            No meets logged yet by this mentor.
          </div>
        ) : (
          <div className="space-y-4">
            {meets.map((meet, index) => {
              const isFlagged = meet.status === 'flagged';
              const aiScorePct = meet.aiScore !== undefined ? Math.round(meet.aiScore * 100) : 0;

              return (
                <div
                  key={meet.id}
                  className={`bg-smp-card p-5 sm:p-6 rounded-3xl border shadow-xs transition-all ${
                    isFlagged ? 'border-red-300 ring-2 ring-red-100 bg-red-50/10' : 'border-smp-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-smp-border/70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-smp-navy text-white text-xs font-bold flex items-center justify-center">
                        #{meets.length - index}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-smp-navy">
                          Meet Session: {meet.date}
                        </div>
                        <div className="text-[11px] text-smp-muted">
                          {meet.attendedMenteeIds.length} Mentees Attended
                        </div>
                      </div>
                    </div>

                    {/* AI Score Badge (SMPC Reviewer Eyes Only) */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          isFlagged
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <span>{isFlagged ? '⚠️ AI Flagged' : '✓ AI Verified'}</span>
                        <span className="text-[10px] opacity-80">({aiScorePct}% AI Score)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {/* Selfie Photo Preview (Click to Zoom) */}
                    <div className="md:col-span-1">
                      <div
                        onClick={() => meet.selfieUrl && setSelectedPhoto(meet.selfieUrl)}
                        className="relative group cursor-pointer rounded-2xl overflow-hidden border border-smp-border shadow-xs aspect-square bg-slate-100"
                      >
                        {meet.selfieUrl ? (
                          <>
                            <img
                              src={meet.selfieUrl}
                              alt="Meet selfie"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                              🔍 Click to Zoom
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-smp-muted">
                            No photo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary & Mentee Notes */}
                    <div className="md:col-span-3 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-smp-brown block mb-1">
                          Meet Summary
                        </span>
                        <p className="text-xs sm:text-sm text-smp-text bg-amber-50/20 p-3.5 rounded-2xl border border-smp-border leading-relaxed">
                          {meet.summary}
                        </p>
                      </div>

                      {meet.menteeNotes && meet.menteeNotes.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-smp-brown block mb-1">
                            Per-Mentee Notes
                          </span>
                          <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-smp-border text-xs">
                            {meet.menteeNotes.map((note, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-bold text-smp-navy">{note.menteeId}: </span>
                                <span className="text-smp-text">{note.note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Coordinator Review Action Controls (If Flagged) */}
                      {isFlagged && (
                        <div className="pt-2 mt-2 border-t border-smp-border flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-red-800">
                            Coordinator Review Decision:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReview(meet.id, 'not_ai')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                            >
                              ✓ Reviewed: Not AI
                            </button>
                            <button
                              onClick={() => handleReview(meet.id, 'confirmed')}
                              className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                            >
                              ⚠️ Reviewed: Confirmed Flag
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* High-Resolution Photo Zoom Modal / Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-smp-card p-2 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={selectedPhoto}
              alt="Expanded meet selfie"
              className="max-w-full max-h-[80vh] rounded-2xl object-contain mx-auto"
            />
            <div className="p-3 text-center text-xs font-semibold text-smp-navy flex justify-between items-center">
              <span>Full-Resolution Selfie Inspection</span>
              <span className="text-smp-muted font-normal">(Click anywhere to close)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
