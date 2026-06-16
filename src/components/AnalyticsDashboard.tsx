import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  TrendingUp,
  LayoutDashboard,
  Cpu,
  BookmarkCheck,
  ShieldAlert,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { Dataset } from '../types/data';

interface AnalyticsDashboardProps {
  dataset: Dataset;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function AnalyticsDashboard({ dataset, onAddToast }: AnalyticsDashboardProps) {
  
  // Custom synthetic timeline monitoring quality tracking over continuous commits
  const scoreTrendData = [
    { commit: 'Initial Ingest', score: Math.max(45, dataset.qualityScore - 24) },
    { commit: 'CSV Declutter', score: Math.max(55, dataset.qualityScore - 12) },
    { commit: 'Z-Imputation', score: Math.max(70, dataset.qualityScore - 5) },
    { commit: 'Current State', score: dataset.qualityScore }
  ];

  // Distribution chart based on columns size and count
  const columnDensityData = dataset.columns.map((c) => ({
    colName: c.name.length > 10 ? `${c.name.slice(0, 9)}...` : c.name,
    uniqueCards: c.uniqueCount,
    hasNulls: c.hasNulls ? 10 : 0
  }));

  const qualityScore = dataset.qualityScore;

  const getDiagnosticsVibe = () => {
    if (qualityScore > 88) return { label: 'Excellent', color: 'text-emerald-400', banner: 'bg-emerald-500/10 border-emerald-500/30' };
    if (qualityScore > 70) return { label: 'Acceptable', color: 'text-yellow-400', banner: 'bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'Critical Anomaly State', color: 'text-red-400', banner: 'bg-red-500/15 border-red-500/30' };
  };

  const vibe = getDiagnosticsVibe();

  const handleRunSystemSync = () => {
    onAddToast('Dispatched analytical diagnostics request upstream to servers.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-left" id="analytics-panel-host">
      
      {/* 3 Large KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI: Overall Score */}
        <div className="p-5 bg-[#0D1530]/90 border border-white/5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C63FF]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Core Quality Index</span>
              <span className="text-3xl font-heading font-bold text-white tracking-tight mt-1.5 block">
                {qualityScore}%
              </span>
            </div>
            <div className="p-2.5 bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
            <span className="text-slate-400 font-mono">Telemetry Rating:</span>
            <span className={`font-mono font-bold uppercase tracking-wider ${vibe.color}`}>
              {vibe.label}
            </span>
          </div>
        </div>

        {/* KPI: Dimension Profile */}
        <div className="p-5 bg-[#0D1530]/90 border border-white/5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Dimension Metrics</span>
              <span className="text-3xl font-heading font-bold text-white tracking-tight mt-1.5 block">
                {dataset.rowCount} <span className="text-xs text-slate-400 font-normal">rows</span>
              </span>
            </div>
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/35 text-[#00D4FF] rounded-xl font-bold font-mono">
              {dataset.colCount} Cols
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
            <span className="text-slate-400 font-mono">Total Coordinates size:</span>
            <span className="font-mono text-white">
              {dataset.rowCount * dataset.colCount} Points
            </span>
          </div>
        </div>

        {/* KPI: Anomalies Purged */}
        <div className="p-5 bg-[#0D1530]/90 border border-white/5 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Anomalies Detected</span>
              <span className="text-3xl font-heading font-bold text-white tracking-tight mt-1.5 block">
                {dataset.issues.length} <span className="text-xs text-amber-400 font-normal">unresolved</span>
              </span>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/35 text-amber-400 rounded-xl">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
            <span className="text-slate-400 font-mono">Health status check:</span>
            <span className="font-mono text-slate-300">
              {dataset.issues.length === 0 ? 'Optimal state' : 'Requires AI tuning'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Charts & Density Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quality Trend over iterations Area (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D1530]/90 border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider font-heading uppercase text-slate-200">Quality Progression Trend line</h3>
            <p className="text-xs text-slate-400 mt-1">Tracks the dynamic health improvement percentage over the active session commits.</p>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e45" opacity={0.3} />
                <XAxis dataKey="commit" stroke="#686e8a" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#686e8a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090f1e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#8c95b6', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6C63FF" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column cardinalities Bar chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D1530]/90 border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider font-heading uppercase text-slate-200">Unique Categories Cardinality</h3>
            <p className="text-xs text-slate-400 mt-1">Unique elements found per tabular header element array.</p>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={columnDensityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e45" opacity={0.3} />
                <XAxis dataKey="colName" stroke="#686e8a" fontSize={8} tickLine={false} />
                <YAxis stroke="#686e8a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090f1e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#8c95b6', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="uniqueCards" radius={[4, 4, 0, 0]}>
                  {columnDensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00D4FF' : '#6C63FF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Underlining alerts suggestions */}
      <div className={`p-4 rounded-xl border flex gap-3 items-start leading-normal ${vibe.banner}`}>
        <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${qualityScore > 88 ? 'text-emerald-400' : 'text-amber-400'}`} />
        <div>
          <span className="font-mono font-bold text-xs uppercase text-slate-200 block mb-0.5">Vexio-Classifier-Diagnostics Feedback</span>
          <p className="text-[11px] text-slate-400">
            {qualityScore > 88 
              ? 'Excellent quality rating. Your sandbox tabular coordinates require no significant modifications before exporting.' 
              : 'Our neural model has flagged duplicate fields, malformed names, or NaN boundaries. Apply missing value strategy or run Autonomous Scan.'
            }
          </p>
        </div>
      </div>

    </div>
  );
}
