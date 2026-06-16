import React from 'react';
import {
  LayoutDashboard,
  Database,
  Sliders,
  Sparkles,
  ToggleLeft,
  ChevronsRight,
  ChevronsLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell,
  Cpu,
  BarChart3,
  Flame,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { UserProfile } from '../types/data';

export type SidebarTabType = 
  | 'dashboard' 
  | 'datasets' 
  | 'manual' 
  | 'ai' 
  | 'missing' 
  | 'encoding' 
  | 'scaling' 
  | 'analytics' 
  | 'settings';

interface SidebarProps {
  activeTab: SidebarTabType;
  onChangeTab: (tab: SidebarTabType) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  user: UserProfile;
  notificationsCount: number;
}

export default function Sidebar({
  activeTab,
  onChangeTab,
  collapsed,
  onToggleCollapsed,
  user,
  notificationsCount
}: SidebarProps) {

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'datasets' as const, label: 'Upload Datasets', icon: <Database className="w-4 h-4" /> },
    { id: 'ai' as const, label: 'AI Scan Screen', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'manual' as const, label: 'Fuzzy Duplicate', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'missing' as const, label: 'Missing Values', icon: <Sliders className="w-4 h-4 text-[#00D4FF]" /> },
    { id: 'encoding' as const, label: 'Encoder Settings', icon: <ToggleLeft className="w-4 h-4 text-indigo-400" /> },
    { id: 'scaling' as const, label: 'Scaling Transform', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'analytics' as const, label: 'Data Analytics', icon: <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> },
    { id: 'settings' as const, label: 'System Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside
      className={`bg-[#0D1530]/90 border-r border-white/5 backdrop-blur-xl shrink-0 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
      id="app-sidebar"
    >
      
      {/* Top Section */}
      <div>
        {/* Sidebar Header Brand with toggle */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded text-slate-950 shadow">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            {!collapsed && (
              <span className="text-base font-heading font-semibold text-white tracking-tight flex items-center gap-1">
                Vexio<span className="text-cyan-400 text-xs">.ai</span>
              </span>
            )}
          </div>

          <button
            onClick={onToggleCollapsed}
            className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-all cursor-pointer"
            title={collapsed ? 'Maximize sidebar' : 'Minimize sidebar'}
            id="sidebar-toggle-btn"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="p-2.5 flex flex-col gap-1 mt-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full py-2 px-3 text-xs rounded-xl flex items-center gap-3 transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-indigo-500/10 text-white font-semibold border-l-2 border-indigo-500 shadow-md'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
                {isActive && collapsed && (
                  <div className="absolute right-1 w-1 h-3.5 bg-[#00D4FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Drawer Area */}
      <div className="border-t border-white/5 p-3 flex flex-col gap-3 bg:slate-950/20">
        
        {/* Support Help desk */}
        <button
          onClick={() => onChangeTab('settings')}
          className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Security documentation"
        >
          <HelpCircle className="w-4 h-4" />
          {!collapsed && <span className="font-medium">Sandbox Help</span>}
        </button>

        {/* User Card Drawer */}
        <div className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'justify-center py-2' : 'p-2 bg-slate-950/40 rounded-xl border border-white/5'}`}>
          <img
            src={user.avatarUrl}
            alt="profile"
            className="w-7 h-7 rounded-full border border-indigo-500/30 object-cover"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-100 truncate tracking-wide">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1 bg-cyan-500/10 border border-cyan-500/30 block shrink-0 text-cyan-400 font-bold rounded">
                  {user.plan}
                </span>
                <span className="text-[8px] text-slate-500 truncate font-mono">Mesh active</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}
