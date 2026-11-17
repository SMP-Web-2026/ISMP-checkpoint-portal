import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menteesApi, MenteeInput } from '../api/mentees';

export const MenteeSetupPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [mentees, setMentees] = useState<MenteeInput[]>([
    { rollNumber: '', name: '', department: '' },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing mentees for this mentor
  useEffect(() => {
    if (!currentUser) return;

    menteesApi
      .getMentees(currentUser.id)
      .then((data) => {
        if (data.length > 0) {
          setMentees(
            data.map((m) => ({
              id: m.id,
              rollNumber: m.rollNumber || '',
              name: m.name,
              department: m.department || '',
            }))
          );
        } else {
          // Provide 5 default blank rows if new mentor
          setMentees([
            { rollNumber: '', name: '', department: '' },
            { rollNumber: '', name: '', department: '' },
            { rollNumber: '', name: '', department: '' },
            { rollNumber: '', name: '', department: '' },
            { rollNumber: '', name: '', department: '' },
          ]);
        }
      })
      .catch((err) => {
        console.error('Failed to load mentees:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser]);

  const updateField = (index: number, field: keyof MenteeInput, value: string) => {
    const updated = [...mentees];
    updated[index] = { ...updated[index], [field]: value };
    setMentees(updated);
    setError(null);
  };

  const addRow = () => {
    if (mentees.length >= 12) return;
    setMentees([...mentees, { rollNumber: '', name: '', department: '' }]);
  };

  const removeRow = (index: number) => {
    if (mentees.length <= 1) return;
    setMentees(mentees.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Check if at least one mentee has a name
    const validMentees = mentees.filter((m) => m.name.trim() !== '');
    if (validMentees.length === 0) {
      setError('Please enter at least one mentee name.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await menteesApi.saveMentees(currentUser.id, mentees);
      setSavedSuccess(true);
      // Brief confirmation before returning to dashboard
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err) {
      setError('Failed to save mentee list. Please try again.');
      setSaving(false);
    }
  };

  const filledCount = mentees.filter((m) => m.name.trim() !== '').length;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-smp-navy border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-smp-muted font-medium">Loading your mentee list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-smp-muted">
        <Link to="/" className="text-smp-navy hover:underline font-medium">
          Dashboard
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-smp-text">Mentee List Setup</span>
      </div>

      <div className="bg-smp-card p-5 sm:p-7 rounded-3xl border border-smp-border shadow-xs">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-smp-border/70">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-smp-navy">
              Assigned Mentee List
            </h1>
            <p className="text-xs text-smp-muted mt-0.5">
              Enter the mentees assigned to you. Entering them once keeps all future meet logs consistent.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-smp-brown font-semibold border border-amber-300 self-start sm:self-auto">
            {filledCount} of {mentees.length} entered
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <span>&#10003;</span>
            <span>Mentee list saved successfully! Returning to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          {mentees.map((mentee, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-amber-50/20 border border-smp-border/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 group"
            >
              {/* Row Number Badge */}
              <div className="w-6 h-6 rounded-lg bg-smp-navy text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 self-start sm:self-auto">
                {index + 1}
              </div>

              {/* 1. Roll Number */}
              <div className="w-full sm:w-32 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Roll No (e.g. 26B0301)"
                  value={mentee.rollNumber}
                  onChange={(e) => updateField(index, 'rollNumber', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-smp-border bg-white focus:outline-none focus:ring-2 focus:ring-smp-navy text-smp-text placeholder:text-smp-muted/60"
                />
              </div>

              {/* 2. Full Name (Required) */}
              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  placeholder={`Mentee ${index + 1} Full Name *`}
                  value={mentee.name}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-smp-border bg-white focus:outline-none focus:ring-2 focus:ring-smp-navy text-smp-text font-medium placeholder:text-smp-muted/60"
                />
              </div>

              {/* 3. Department */}
              <div className="w-full sm:w-44 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Department (e.g. CSE)"
                  value={mentee.department}
                  onChange={(e) => updateField(index, 'department', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-smp-border bg-white focus:outline-none focus:ring-2 focus:ring-smp-navy text-smp-text placeholder:text-smp-muted/60"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={mentees.length <= 1}
                title="Remove mentee"
                className="self-end sm:self-auto w-7 h-7 rounded-lg text-smp-brown hover:bg-amber-100/80 disabled:opacity-20 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}

          {/* Add mentee button (Up to 12) */}
          {mentees.length < 12 && (
            <button
              type="button"
              onClick={addRow}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-smp-border hover:border-smp-navy/40 hover:bg-amber-50/40 text-smp-navy text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>+ Add Another Mentee ({12 - mentees.length} remaining)</span>
            </button>
          )}

          {/* Form Actions footer */}
          <div className="pt-4 mt-2 border-t border-smp-border flex items-center justify-between gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-smp-muted hover:text-smp-text hover:bg-amber-50/50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || savedSuccess || filledCount === 0}
              className="px-6 py-2.5 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Mentee List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
