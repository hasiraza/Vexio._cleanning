import React, { useState } from 'react';
import {
  Search,
  Bell,
  LogOut,
  Sparkles,
  BookOpen,
  User,
  ShieldAlert,
  ChevronDown,
  Terminal,
  Activity,
  Check
} from 'lucide-react';
import { UserProfile, ActiveToast } from '../types/data';

interface TopBarProps {
  user: UserProfile;
  activeTab: string;
  onLogout: () => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function TopBar({
  user,
  activeTab,
  onLogout,
  onAddToast
}: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const notifications = [
    { id: 1, text: 'Clinical telemetry dataset scanned successfully', time: '5m ago', type: 'info' },
    { id: 2, text: '6 null values found in us_state categories auto-imputed', time: '14m ago', type: 'success' },
    { id: 3, text: 'Z-score extreme outliers detected in sensor column (BP:380)', time: '1h ago', type: 'warning' },
  ];

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onAddToast(`Search filtered dataset matrix for: "${searchVal}"`, 'info');
      setSearchVal('');
    }
  };

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return { parent: 'Workspace Root', child: 'Active Dashboard' };
      case 'datasets':
        return { parent: 'Data Ingest', child: 'Secure CSV/XLSX Upload' };
      case 'ai':
        return { parent: 'Neural pipeline', child: 'AI Incident Scanner' };
      case 'manual':
        return { parent: 'Fuzzy logic', child: 'Levenshtein Deduplicator' };
      case 'missing':
        return { parent: 'Imputation model', child: 'Missing Value Strategy' };
      case 'encoding':
        return { parent: 'Variables', child: 'One-Hot Category Encoder' };
      case 'scaling':
        return { parent: 'Transformation', child: 'Feature Scaling Z-Normalizer' };
      case 'analytics':
        return { parent: 'KPI Analytics', child: 'Data Quality Insights' };
      case 'settings':
        return { parent: 'Authentication', child: 'Profile & Settings' };
      default:
        return { parent: 'Vexio mesh', child: 'General Workbench' };
    }
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="h-16 bg-[#0E1532]/60 backdrop-blur-md px-6 flex items-center justify-between border-b border-white/5 relative z-30" id="app-topbar">
      
      {/* Left breadcrumb trace */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-mono tracking-wide">{breadcrumbs.parent}</span>
        <span className="text-slate-600 text-xs font-mono">➔</span>
        <span className="text-xs text-cyan-400 font-semibold tracking-wide font-heading uppercase">{breadcrumbs.child}</span>
      </div>

      {/* Center Search Input Mesh */}
      <form onSubmit={handleGlobalSearch} className="hidden md:flex items-center relative w-72 max-w-sm">
        <Search className="absolute left-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search columns, logs, or API keys..."
          className="w-full bg-[#0A0F1E]/80 border border-white/5 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 hover:border-white/10 transition-all font-mono"
        />
      </form>

      {/* Right Controls Area */}
      <div className="flex items-center gap-4">
        
        {/* Sync Mode state */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/35 rounded text-[10px] text-emerald-400 font-mono font-medium">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          MESH SECURED (SSL)
        </div>

        {/* Notifications Icon with layout dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(prev => !prev);
              setShowProfileMenu(false);
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl relative transition-all text-slate-400 hover:text-white cursor-pointer"
            id="notifications-toggle"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00D4FF] rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00D4FF] rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-[#0E1532] border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50 text-left" id="notifications-dropdown">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-heading">Mesh Notifications</span>
                <button
                  onClick={() => {
                    onAddToast('Marked all notifications as read.', 'success');
                    setShowNotifications(false);
                  }}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2 border border-white/5 bg-[#0a0f1e]/60 rounded-lg flex flex-col gap-1 hover:border-[#6C63FF]/30 transition-colors">
                    <p className="text-[11px] text-slate-200 leading-normal">{notif.text}</p>
                    <span className="text-[9px] text-slate-500 font-mono">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown drawer select */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(prev => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all text-left cursor-pointer"
            id="profile-dropdown-toggle"
          >
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-6.5 h-6.5 rounded-full border border-[#6C63FF]/30"
            />
            <span className="hidden sm:inline text-xs text-slate-300 font-semibold">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0E1532] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-left" id="profile-dropdown">
              <div className="p-3 border-b border-white/5 bg-slate-950/20">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
              </div>

              <div className="p-1 flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    onAddToast('Opening profile settings...', 'info');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  My Profiles
                </button>
                <button
                  onClick={() => {
                    onAddToast('Sandbox network connection is live.', 'success');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  API Documentation
                </button>
              </div>

              <div className="p-1 border-t border-white/5 bg-slate-950/20">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left py-2.5 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Shutdown Session
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
