import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import smpLogo from '../../assets/smp-logo.png';

interface NavbarProps {
  userRole?: 'mentor' | 'smpc_admin' | null;
  userName?: string;
  onLogout?: () => void;
  showDevSwitcher?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole = 'mentor',
  userName = 'Tanmay (Demo)',
  showDevSwitcher = true,
}) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full bg-smp-navy text-white shadow-sm border-b border-white/10">
      {/* 
        Responsive Container:
        - Mobile: compact padding, single-line brand title
        - Desktop: max-w-7xl with spacious distribution
      */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand with Official SMP Logo */}
        <Link to="/" className="flex items-center gap-3 text-white no-underline min-w-0 group">
          {/* Logo sized proportionately with the title */}
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

        {/* Right: User identity & temporary Stage 0 dev switcher */}
        <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
          {userName && (
            <div className="hidden xs:flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/15">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold text-amber-300">
                {userRole === 'smpc_admin' ? 'A' : 'M'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-semibold text-xs text-slate-100">{userName}</span>
                <span className="text-[10px] text-amber-200 capitalize font-medium">
                  {userRole === 'smpc_admin' ? 'SMPC Coordinator' : 'ISMP Mentor'}
                </span>
              </div>
            </div>
          )}

          {/* 
            Temporary dev switcher for Stage 0 testing.
            Kept compact on mobile so title stays intact.
          */}
          {showDevSwitcher && (
            <div className="flex items-center bg-black/25 p-0.5 sm:p-1 rounded-lg border border-white/10">
              <Link
                to="/"
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
                  location.pathname === '/' || !location.pathname.startsWith('/admin')
                    ? 'bg-amber-400 text-smp-navy font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Mentor
              </Link>
              <Link
                to="/admin"
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-400 text-smp-navy font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
