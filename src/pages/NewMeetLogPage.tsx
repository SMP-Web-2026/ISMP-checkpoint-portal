import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menteesApi } from '../api/mentees';
import { meetsApi } from '../api/meets';
import { Mentee, MenteeNote } from '../types';

export const NewMeetLogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wizard Steps: 1. Selfie -> 2. Attendance -> 3. Notes -> 4. Review
  const [step, setStep] = useState<number>(1);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loadingMentees, setLoadingMentees] = useState<boolean>(true);

  // Form State
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [selectedMenteeIds, setSelectedMenteeIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [menteeNotes, setMenteeNotes] = useState<Record<string, string>>({});

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load mentor's mentees
  useEffect(() => {
    if (!currentUser) return;
    menteesApi
      .getMentees(currentUser.id)
      .then((data) => {
        setMentees(data);
        // By default, pre-select all mentees as present for convenience
        setSelectedMenteeIds(data.map((m) => m.id));
      })
      .finally(() => {
        setLoadingMentees(false);
      });
  }, [currentUser]);

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelfieDataUrl(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Mentee Selection Toggles
  const toggleMentee = (id: string) => {
    setSelectedMenteeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedMenteeIds(mentees.map((m) => m.id));
  const clearAll = () => setSelectedMenteeIds([]);

  // Note change for a mentee
  const handleNoteChange = (menteeId: string, note: string) => {
    setMenteeNotes((prev) => ({ ...prev, [menteeId]: note }));
  };

  // Step Validation & Navigation
  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!selfieDataUrl) {
        setError('Please upload or capture a selfie photo of your meet.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedMenteeIds.length === 0) {
        setError('Please select at least one mentee who attended the meet.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!summary.trim()) {
        setError('Please write a short overall summary of the meet session.');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    if (!currentUser || !selfieDataUrl) return;

    setSubmitting(true);
    setError(null);

    // Format per-mentee notes array
    const notesArray: MenteeNote[] = selectedMenteeIds
      .filter((id) => menteeNotes[id] && menteeNotes[id].trim() !== '')
      .map((id) => ({
        menteeId: id,
        note: menteeNotes[id].trim(),
      }));

    try {
      await meetsApi.createMeetLog(currentUser.id, {
        selfieUrl: selfieDataUrl,
        summary: summary.trim(),
        attendedMenteeIds: selectedMenteeIds,
        menteeNotes: notesArray,
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError('Failed to submit meet log. Please try again.');
      setSubmitting(false);
    }
  };

  const menteeMap = new Map(mentees.map((m) => [m.id, m.name]));

  if (loadingMentees) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-smp-navy border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-smp-muted font-medium">Preparing meet log form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/" className="text-smp-navy hover:underline font-medium">
          Dashboard
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-smp-text">Log New Meet</span>
      </div>

      <div className="bg-smp-card p-5 sm:p-7 rounded-3xl border border-smp-border shadow-xs">
        
        {/* Step Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-smp-border/70">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-smp-navy">
                Log Checkpoint Meet
              </h1>
              <p className="text-xs text-smp-muted mt-0.5">
                Step {step} of 4: {
                  step === 1 ? 'Upload Selfie Proof' :
                  step === 2 ? 'Select Attendees' :
                  step === 3 ? 'Session Notes' :
                  'Review & Submit'
                }
              </p>
            </div>
            <span className="text-xs font-bold text-smp-navy bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              Step {step}/4
            </span>
          </div>

          {/* Step Pill Indicators */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {['1. Selfie', '2. Attendance', '3. Notes', '4. Review'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === step;
              const isDone = stepNum < step;
              return (
                <div
                  key={i}
                  className={`py-1.5 text-center text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-smp-navy text-white shadow-2xs'
                      : isDone
                      ? 'bg-amber-200/80 text-smp-navy font-bold'
                      : 'bg-amber-50 text-smp-muted border border-amber-100'
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {submittedSuccess && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold text-center flex flex-col items-center gap-1">
            <span className="text-lg">&#10003;</span>
            <span className="text-sm">Meet logged successfully!</span>
            <span className="text-[11px] font-normal text-emerald-700">Returning to your dashboard...</span>
          </div>
        )}

        {/* STEP 1: Upload Selfie Proof */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center p-6 sm:p-8 rounded-2xl border-2 border-dashed border-smp-border bg-amber-50/20">
              {selfieDataUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={selfieDataUrl}
                      alt="Meet selfie preview"
                      className="max-h-64 rounded-2xl border border-smp-border shadow-xs mx-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setSelfieDataUrl(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-xs text-smp-muted">
                    Photo attached. Click below to change it or proceed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-smp-navy flex items-center justify-center mx-auto text-xl">
                    📸
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-smp-navy">
                      Upload Group Selfie with Mentees
                    </h3>
                    <p className="text-xs text-smp-muted mt-1 max-w-sm mx-auto">
                      Proof of attendance required for SMPC checkpoint verification. Take or select a photo with all attendees present.
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-smp-navy text-white text-xs font-semibold hover:bg-smp-navy-hover transition-colors shadow-xs cursor-pointer"
                >
                  {selfieDataUrl ? 'Choose Different Photo' : 'Select or Take Photo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Select Mentees Present */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-smp-navy">
                  Who was present at this meet?
                </h3>
                <p className="text-xs text-smp-muted mt-0.5">
                  Tap to select mentees who attended this session.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-smp-navy font-semibold hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-xs text-smp-muted">&bull;</span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-smp-brown font-semibold hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/40 rounded-xl border border-amber-200/70 text-xs text-smp-brown font-semibold flex items-center justify-between">
              <span>Selected Attendance:</span>
              <span>{selectedMenteeIds.length} of {mentees.length} mentees present</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mentees.map((mentee) => {
                const isSelected = selectedMenteeIds.includes(mentee.id);
                return (
                  <button
                    key={mentee.id}
                    type="button"
                    onClick={() => toggleMentee(mentee.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100/70 border-smp-navy/40 shadow-2xs'
                        : 'bg-white border-smp-border hover:bg-amber-50/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-smp-navy">
                        {mentee.name}
                      </div>
                      <div className="text-[11px] text-smp-muted">
                        {mentee.rollNumber ? `${mentee.rollNumber}` : ''}
                        {mentee.rollNumber && mentee.department ? ' | ' : ''}
                        {mentee.department ? `${mentee.department}` : ''}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-smp-navy text-white'
                          : 'border border-smp-border bg-white text-transparent'
                      }`}
                    >
                      &#10003;
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Write Notes & Overall Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-smp-navy uppercase tracking-wider mb-1.5">
                Overall Meet Summary *
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Where did you meet? What core topics were discussed (e.g. branch electives, quiz prep, hostel settling)?"
                className="w-full p-3 rounded-xl border border-smp-border bg-amber-50/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-smp-navy focus:bg-white transition-all text-smp-text leading-relaxed"
              />
            </div>

            {/* Individual Mentee Notes */}
            <div className="space-y-2 pt-2 border-t border-smp-border">
              <div>
                <h4 className="text-xs font-bold text-smp-navy uppercase tracking-wider">
                  Individual Mentee Notes (Optional)
                </h4>
                <p className="text-[11px] text-smp-muted">
                  Note any mentee who shared specific concerns, needs support, or made special progress.
                </p>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedMenteeIds.map((id) => (
                  <div key={id} className="p-3 bg-amber-50/20 rounded-xl border border-smp-border/80">
                    <span className="text-xs font-bold text-smp-brown block mb-1">
                      {menteeMap.get(id)}:
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Prepared for midsem, or facing trouble with lab timing..."
                      value={menteeNotes[id] || ''}
                      onChange={(e) => handleNoteChange(id, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-smp-border bg-white focus:outline-none focus:ring-2 focus:ring-smp-navy text-smp-text"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-smp-navy">
                Review Checkpoint Submission
              </h3>
              <p className="text-xs text-smp-muted mt-0.5">
                Verify the details before submitting this meet for SMPC evaluation.
              </p>
            </div>

            <div className="space-y-3 bg-amber-50/20 p-4 rounded-2xl border border-smp-border">
              {/* Selfie thumbnail & date */}
              <div className="flex items-center gap-3 pb-3 border-b border-smp-border">
                {selfieDataUrl && (
                  <img
                    src={selfieDataUrl}
                    alt="Selfie"
                    className="w-14 h-14 rounded-xl object-cover border border-smp-border shadow-2xs"
                  />
                )}
                <div>
                  <div className="text-xs font-bold text-smp-navy">Meet Selfie Verified</div>
                  <div className="text-[11px] text-smp-muted">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Attendees */}
              <div>
                <span className="text-[10px] font-bold uppercase text-smp-brown block mb-1.5">
                  Attendees ({selectedMenteeIds.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMenteeIds.map((id) => (
                    <span
                      key={id}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-smp-brown font-medium"
                    >
                      {menteeMap.get(id)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <span className="text-[10px] font-bold uppercase text-smp-brown block mb-1">
                  Overall Summary
                </span>
                <p className="text-xs sm:text-sm text-smp-text bg-white p-3 rounded-xl border border-smp-border leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* Per-mentee notes preview */}
              {selectedMenteeIds.some((id) => menteeNotes[id] && menteeNotes[id].trim()) && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-smp-brown block mb-1">
                    Specific Mentee Notes
                  </span>
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-smp-border text-xs">
                    {selectedMenteeIds
                      .filter((id) => menteeNotes[id] && menteeNotes[id].trim())
                      .map((id) => (
                        <div key={id} className="text-xs">
                          <span className="font-bold text-smp-navy">{menteeMap.get(id)}: </span>
                          <span className="text-smp-text">{menteeNotes[id]}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-6 pt-4 border-t border-smp-border flex items-center justify-between gap-3">
          {step === 1 ? (
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-smp-muted hover:text-smp-text transition-colors"
            >
              Cancel
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting || submittedSuccess}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-smp-brown bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
            >
              &larr; Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || submittedSuccess}
              className="px-6 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : submittedSuccess ? 'Submitted!' : 'Submit Checkpoint Meet ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
