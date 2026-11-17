import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import smpLogo from '../assets/smp-logo.png';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (identifier: string) => {
    setError(null);
    try {
      const user = await login(identifier);
      // Role-based redirect as specified in AGENTS.md
      if (user.role === 'smpc_admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your institute email address.');
      return;
    }
    handleLogin(email);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-4 sm:pt-10 pb-12">
      <div className="w-full max-w-md bg-smp-card p-6 sm:p-8 rounded-3xl shadow-sm border border-smp-border text-center">
        
        {/* Emblem / Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-smp-navy rounded-2xl p-2 flex items-center justify-center shadow-xs">
          <img 
            src={smpLogo} 
            alt="SMP Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-smp-navy mb-1 tracking-tight">
          ISMP Checkpoint Portal
        </h1>
        <p className="text-xs sm:text-sm text-smp-muted mb-6">
          Student Mentor Program &bull; Academic Year 2026-27
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left">
            {error}
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-smp-navy uppercase tracking-wider mb-1.5">
              Institute Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. mentor@smp.college.edu"
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-smp-border bg-amber-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-smp-navy focus:bg-white transition-all text-smp-text"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-smp-navy hover:bg-smp-navy-hover text-white text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In with Email'}
          </button>
        </form>

        {/* Demo Fast Login Selector (Clearly marked as fake per AGENTS.md Stage 1.1) */}
        <div className="mt-8 pt-6 border-t border-smp-border text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-smp-brown uppercase tracking-wider">
              Fast Demo Accounts (Fake Data)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-smp-brown font-medium border border-amber-200">
              Stage 1 Demo
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleLogin('mentor')}
              disabled={loading}
              className="w-full py-2.5 px-3.5 rounded-xl border border-smp-border bg-smp-card hover:bg-amber-100/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-smp-navy group-hover:text-smp-navy-hover">
                  Tanmay Sonkar (ISMP Mentor)
                </div>
                <div className="text-[11px] text-smp-muted">
                  tanmay@smp.college.edu &bull; Role: Mentor
                </div>
              </div>
              <span className="text-xs text-smp-navy font-bold">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleLogin('admin')}
              disabled={loading}
              className="w-full py-2.5 px-3.5 rounded-xl border border-smp-border bg-smp-card hover:bg-amber-100/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-smp-navy group-hover:text-smp-navy-hover">
                  Arnav Oza (SMPC Coordinator)
                </div>
                <div className="text-[11px] text-smp-muted">
                  smpc@smp.college.edu &bull; Role: SMPC Admin
                </div>
              </div>
              <span className="text-xs text-smp-navy font-bold">&rarr;</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-smp-muted mt-6">
          Mentors stay logged in on this device. SMPCs review all meets & flags.
        </p>
      </div>
    </div>
  );
};
