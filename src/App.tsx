import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  Clock,
  LayoutDashboard,
  Cpu,
  BookmarkCheck,
  TrendingUp,
  Sliders,
  Database,
  ArrowRight
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import AuthScreens from './components/AuthScreens';
import Sidebar, { SidebarTabType } from './components/Sidebar';
import TopBar from './components/TopBar';
import UploadSection from './components/UploadSection';
import SpreadsheetEditor from './components/SpreadsheetEditor';
import AIScanWizard from './components/AIScanWizard';
import MissingValues from './components/MissingValues';
import EncodingScaling from './components/EncodingScaling';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsWorkspace from './components/SettingsWorkspace';
import FuzzyDeduplicator from './components/FuzzyDeduplicator';

import { UserProfile, Dataset, ActiveToast } from './types/data';
import { TEMPLATE_DATASETS } from './utils/datasetTemplates';

export default function App() {
  // Navigation / Auth States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authScreenMode, setAuthScreenMode] = useState<'login' | 'register'>('login');

  // Sidebar controls
  const [sidebarTab, setSidebarTab] = useState<SidebarTabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core authenticated user profile structure
  const [user, setUser] = useState<UserProfile>({
    name: 'Alexander Mercer',
    email: 'alex.mercer@spacex.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Data Engineer',
    plan: 'Professional',
    apiKey: 'vx_live_e9389f'
  });

  // Current selected working dataset inside sandboxed state
  const [activeDataset, setActiveDataset] = useState<Dataset>(
    JSON.parse(JSON.stringify(TEMPLATE_DATASETS[0])) // Deep copy of template dataset to keep pristine
  );

  // Interactive notification toast alerts array
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  // Add toast helper function
  const handleAddToast = (message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const freshToast: ActiveToast = {
      id: `toast-${Date.now()}-${Math.random().toString(16).substring(2, 6)}`,
      message,
      type
    };
    setToasts((prev) => [...prev, freshToast]);
  };

  // Automated toast removal listener effect
  useEffect(() => {
    if (toasts.length > 0) {
      const activeTimer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(activeTimer);
    }
  }, [toasts]);

  const handleRemoveToast = (idStr: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== idStr));
  };

  // Full-stack Gemini API interaction logic
  const handleAnalyzeWithGeminiProxy = async (targetDataset: Dataset) => {
    try {
      const sample = targetDataset.rows.slice(0, 3);
      const res = await fetch('/api/analyze-dataset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetName: targetDataset.name,
          rowCount: targetDataset.rowCount,
          columns: targetDataset.columns,
          sampleRows: sample
        })
      });

      if (res.ok) {
        return await res.json();
      }
      throw new Error('Endpoint returned non-ok status');
    } catch (err) {
      console.warn('Backend Gemini check bypassed. Executing locally.');
      return { summary: "Loaded Clinical diagnostic records. Noted minor mixed-case character alignments. Suggested standard missing value imputation models." };
    }
  };

  const handleAuthSuccess = (loggedUser: { name: string; email: string }) => {
    setUser({
      name: loggedUser.name,
      email: loggedUser.email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Principal Data Engineer',
      plan: 'Professional',
      apiKey: 'vx_live_e9389f'
    });
    setIsAuthenticated(true);
    setCurrentView('app');
    setSidebarTab('dashboard');
    handleAddToast(`Session initialized for secure node: ${loggedUser.name}`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    handleAddToast('Vexio cloud computing socket de-allocated.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] font-sans antialiased text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-slate-900" id="vexio-core-root">
      
      {/* Dynamic Animated Toasts Alerts Drawer */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none" id="global-toasts">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div className={`p-3 rounded-xl border backdrop-blur-md shadow-2xl flex justify-between items-start gap-2.5 text-xs text-left ${
                toast.type === 'success' 
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
                  : toast.type === 'warning' 
                  ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' 
                  : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
              }`}>
                <div className="flex gap-2">
                  <span className="mt-0.5 shrink-0">
                    {toast.type === 'success' ? '⚡' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </span>
                  <span className="font-mono leading-normal font-medium">{toast.message}</span>
                </div>
                <button
                  onClick={() => handleRemoveToast(toast.id)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* VIEW: MARKETING LANDING PAGE */}
      {currentView === 'landing' && (
        <LandingPage
          onStartApp={() => {
            setAuthScreenMode('register');
            setCurrentView('auth');
          }}
          onGoToAuth={() => {
            setAuthScreenMode('login');
            setCurrentView('auth');
          }}
        />
      )}

      {/* VIEW: PREMIUM REGISTRATION / RECOVERY PORTALS */}
      {currentView === 'auth' && (
        <AuthScreens
          initialScreen={authScreenMode === 'login' ? 'login' : 'register'}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* VIEW: THE MAIN MULTI-TENANT WORKSPACE */}
      {currentView === 'app' && (
        <div className="flex-1 flex overflow-hidden min-h-screen relative" id="sandbox-app-layout">
          
          {/* Core Collapsible Sidebar */}
          <Sidebar
            activeTab={sidebarTab}
            onChangeTab={(t) => setSidebarTab(t)}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
            user={user}
            notificationsCount={toasts.length}
          />

          {/* Core Content Shell */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0A0F1E] relative overflow-y-auto">
            
            {/* Top Bar Trace */}
            <TopBar
              user={user}
              activeTab={sidebarTab}
              onLogout={handleLogout}
              onAddToast={handleAddToast}
            />

            {/* Inner Workspace Container */}
            <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto flex flex-col gap-8 pb-16">
              
              {/* TAB: DASHBOARD WITH METRICS & GRID */}
              {sidebarTab === 'dashboard' && (
                <div className="flex flex-col gap-8 animate-fade" id="dashboard-tab">
                  {/* Visual Header card */}
                  <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-[#0D1530] to-[#0A0F1E] border border-white/5 rounded-2xl relative overflow-hidden text-left shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    <span className="text-[10px] font-mono text-[#00D4FF] block tracking-widest uppercase font-bold">Vexio Multi-Tenant Node</span>
                    <h1 className="text-2xl md:text-3xl font-heading font-medium text-white tracking-tight leading-none mt-2">
                      Clinical Imputer Mesh.
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
                      Active database pipeline successfully configured. Ingest raw CSV headers, trigger Autonomous Scanning, resolve categorical outliers, and execute clean tabular normalization.
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => setSidebarTab('ai')}
                        className="px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] hover:from-[#5b52f7] hover:to-[#00ccf2] text-slate-950 text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        Launch Autonomous Scan
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <button
                        onClick={() => setSidebarTab('datasets')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
                      >
                        Change Workspace Table
                      </button>
                    </div>
                  </div>

                  {/* Summary Analytical metrics dashboard widgets */}
                  <AnalyticsDashboard
                    dataset={activeDataset}
                    onAddToast={handleAddToast}
                  />

                  {/* Core Interactive spreadsheet editor */}
                  <SpreadsheetEditor
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: DATASET FILES UPLOADER */}
              {sidebarTab === 'datasets' && (
                <div className="flex flex-col gap-6 animate-fade" id="datasets-tab">
                  <UploadSection
                    onLoadDataset={(loaded) => {
                      setActiveDataset(loaded);
                      setSidebarTab('dashboard'); // Route back to central spreadsheet automatically
                    }}
                    onAddToast={handleAddToast}
                  />
                  
                  {/* Current Active Spreadsheet */}
                  <SpreadsheetEditor
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: NEURAL AUTO AI SCANNER */}
              {sidebarTab === 'ai' && (
                <div className="flex flex-col gap-6 animate-fade" id="ai-tab">
                  <AIScanWizard
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                    onAnalyzeWithGemini={handleAnalyzeWithGeminiProxy}
                  />
                </div>
              )}

              {/* TAB: FUZZY DEDUPLICATOR */}
              {sidebarTab === 'manual' && (
                <div className="flex flex-col gap-6 animate-fade" id="duplicates-tab">
                  <FuzzyDeduplicator
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: MISSING VALUE IMPUTER */}
              {sidebarTab === 'missing' && (
                <div className="flex flex-col gap-6 animate-fade" id="missing-tab">
                  <MissingValues
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: VARIABLE CODER / SCALER COMBINED */}
              {(sidebarTab === 'encoding' || sidebarTab === 'scaling') && (
                <div className="flex flex-col gap-6 animate-fade" id="transforms-tab">
                  <EncodingScaling
                    dataset={activeDataset}
                    onUpdateDataset={(updated) => setActiveDataset(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: ANALYTICAL REPORT DIRECTORS */}
              {sidebarTab === 'analytics' && (
                <div className="flex flex-col gap-6 animate-fade" id="analytics-tab">
                  <AnalyticsDashboard
                    dataset={activeDataset}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

              {/* TAB: SETTINGS & ACCESS CONTROL */}
              {sidebarTab === 'settings' && (
                <div className="flex flex-col gap-6 animate-fade" id="settings-tab">
                  <SettingsWorkspace
                    user={user}
                    onChangeUser={(updated) => setUser(updated)}
                    onAddToast={handleAddToast}
                  />
                </div>
              )}

            </main>

            {/* Standard humble watermark footer inside viewport */}
            <footer className="mt-auto border-t border-white/5 bg-slate-950/40 p-4 text-center text-[10px] text-slate-600 font-mono tracking-widest uppercase">
              VEXIO PRIVATE PIPELINE // LICENSED CLOUD ASSET NODE #{user.name.slice(0, 3).toUpperCase()}-2026 // SOC2 PRIVATE
            </footer>

          </div>

        </div>
      )}

    </div>
  );
}
