import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import smpLogo from '../../assets/smp-logo.png';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-smp-navy text-white shadow-sm border-b border-white/10">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand with Official SMP Logo */}
        <Link to={currentUser ? (currentUser.role === 'smpc_admin' ? '/admin' : '/') : '/login'} className="flex items-center gap-3 text-white no-underline min-w-0 group">
          <div className="h-10 sm:h-11 flex-shrink-0 flex items-center justify-center">
            <img 
              src={smpLogo} 
              alt="SMP Logo" 
              className="h-full w-auto object-contain block drop-shadow-xs"
            />
          </div>

          <div className="flex flex-col min-w-0 justify-center">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight whitespace-nowrap group-hover:text-amber-200 transition-colors">
              ISMP Checkpoint Portal
            </span>
            <span className="text-[11px] sm:text-xs text-amber-200/80 font-medium whitespace-nowrap">
              Student Mentor Program
            </span>
          </div>
        </Link>

        {/* Right: Logged-in User Identity & Logout Button */}
        {currentUser ? (
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/15">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold text-amber-300">
                {currentUser.role === 'smpc_admin' ? 'A' : 'M'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-semibold text-xs text-slate-100">{currentUser.name}</span>
                <span className="text-[10px] text-amber-200 capitalize font-medium">
                  {currentUser.role === 'smpc_admin' ? 'SMPC Coordinator' : 'ISMP Mentor'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-amber-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 text-smp-navy hover:bg-amber-300 transition-all shadow-xs"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};
