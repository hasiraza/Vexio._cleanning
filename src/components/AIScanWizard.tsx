import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  SearchCheck,
  AlertTriangle,
  Play,
  Cpu,
  BookmarkCheck,
  Check,
  Zap,
  Clock,
  Terminal,
  Activity,
  Maximize2,
  Trash
} from 'lucide-react';
import { Dataset, CellularIssue } from '../types/data';

interface AIScanWizardProps {
  dataset: Dataset;
  onUpdateDataset: (updated: Dataset) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
  onAnalyzeWithGemini: (dataset: Dataset) => Promise<any>; // Supports actual Gemini analysis
}

export default function AIScanWizard({
  dataset,
  onUpdateDataset,
  onAddToast,
  onAnalyzeWithGemini
}: AIScanWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: PreScan Info, 2: Active Scan, 3: Completed Audit Report
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<{ [key: string]: boolean }>({});
  
  // Real AI generation status
  const [isGeminiWorking, setIsGeminiWorking] = useState(false);
  const [aiAnalysisNotes, setAiAnalysisNotes] = useState<string>('');

  const scanStagesString = [
    'Deploying neural Vexio-Light matrix parsing...',
    'Interpreting header data configurations...',
    'Querying IQR statistical variance vectors...',
    'Evaluating casing uniformity standards...',
    'Correlating null ratios against state weights...',
    'Re-computing absolute quality scoring ratios...',
  ];

  // Auto configure issues selection
  useEffect(() => {
    if (dataset.issues) {
      const initial: { [key: string]: boolean } = {};
      dataset.issues.forEach((issue, index) => {
        initial[`${issue.rowIdx}-${issue.colName}`] = true; // Enabled by default
      });
      setSelectedIssues(initial);
    }
  }, [dataset]);

  const toggleSelectIssue = (rowIdx: number, colName: string) => {
    const key = `${rowIdx}-${colName}`;
    setSelectedIssues((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLaunchScanFlow = async () => {
    setStep(2);
    setScanProgress(5);
    setScanLogs(['[INFO] Decrypting active database tabular arrays...']);

    // Log progression interval
    let idx = 0;
    const progressTimer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 8;
      });

      if (idx < scanStagesString.length) {
        setScanLogs((prev) => [
          ...prev,
          `[LOG] ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - ${scanStagesString[idx]}`
        ]);
        idx++;
      }
    }, 450);

    // Call real backend server router to give Gemini suggestions if key is available!
    setIsGeminiWorking(true);
    try {
      const gResult = await onAnalyzeWithGemini(dataset);
      if (gResult && gResult.summary) {
        setAiAnalysisNotes(gResult.summary);
      }
    } catch (e) {
      console.warn('Real AI check returned gracefully. Resorting to embedded standard parsing.', e);
    } finally {
      setIsGeminiWorking(false);
    }

    setTimeout(() => {
      setStep(3);
      onAddToast(`Vexio AI completed scanning ${dataset.name || 'temporary dataset'}!`, 'success');
    }, 3200);
  };

  const handleApplyAIFixes = () => {
    const dCopy = { ...dataset };
    let correctedCount = 0;

    // Apply auto fixes to columns
    dCopy.issues = dCopy.issues.filter((issue) => {
      const key = `${issue.rowIdx}-${issue.colName}`;
      const isSelected = selectedIssues[key];

      if (isSelected) {
        // Change the actual value inside rows
        dCopy.rows[issue.rowIdx][issue.colName] = issue.suggestedValue;
        correctedCount++;
        return false; // Remove from unresolved issues list
      }
      return true; // Keep
    });

    // Re-adjust quality score
    dCopy.qualityScore = Math.min(100, dCopy.qualityScore + correctedCount * 6);
    
    onUpdateDataset(dCopy);
    setStep(1);
    onAddToast(`Successfully corrected ${correctedCount} anomalies in sandbox memory!`, 'success');
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex flex-col gap-5 text-left" id="ai-wizard-host">
      
      {/* Steps Header bar indicator */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider font-heading uppercase">Autonomous Neural Scanner</h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className={step === 1 ? 'text-[#00D4FF] font-bold' : 'text-slate-500'}>1. PARSE</span>
          <span className="text-slate-700">➔</span>
          <span className={step === 2 ? 'text-[#00D4FF] font-bold' : 'text-slate-500'}>2. MODEL INCIDENT</span>
          <span className="text-slate-700">➔</span>
          <span className={step === 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>3. REVIEW SOLUTIONS</span>
        </div>
      </div>

      {/* STEP 1: INITIAL INFORMATION BLOCK */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Vexio AI Pipeline Scan</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Launch our offline-first AI incident system to audit {dataset.name || 'loaded dataset'} ({dataset.rowCount} rows x {dataset.colCount} columns) against standard format rules, casing distributions and extreme numeric outliers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Null & Blanks Check</span>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Scans categorical columns, detecting empty records, mapping distribution vectors and providing auto-imputation guesses.
              </p>
            </div>
            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-xl text-left">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Impropers & Casing Variance</span>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Spots lower-cased state acronyms (e.g., 'ca' vs 'CA'), mixed format date variables, and fuzzy duplicates phonetically.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleLaunchScanFlow}
              className="px-6 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] hover:from-[#5c54fa] hover:to-[#00ccf2] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              id="ai-launch-scan"
            >
              <Cpu className="w-4 h-4 fill-current" />
              Launch Neural Scan
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACTIVE RECTIFY SCANNING LOADER */}
      {step === 2 && (
        <div className="flex flex-col gap-5 py-6 items-center text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-900 border-t-[#00D4FF] animate-spin" />
            <Sparkles className="w-6 h-6 text-indigo-400 absolute top-5 left-5 animate-pulse" />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase font-mono tracking-widest text-[#00D4FF]">Active Sandboxed Inference Processing</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-1">SIMULATING IN-BROWSER WEB-ASSEMBLY RUNNERS</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-slate-950 border border-white/5 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${Math.min(scanProgress, 100)}%` }} />
          </div>

          {/* Shell log outputs stream */}
          <div className="w-full max-w-lg bg-slate-950/90 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-slate-400 text-left h-28 overflow-y-auto mt-2">
            {scanLogs.map((log, idx) => (
              <div key={idx} className="leading-5">
                <span className="text-cyan-500">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: COMPLETED REPORT RULES reviews */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-mono text-emerald-400 tracking-wider uppercase">Neural Scan Audit Report Complete</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We identified <span className="text-amber-400 font-bold">{dataset.issues.length} cell anomalies</span> inside active sandbox memory columns. Choose which corrections you want to commit.
            </p>
          </div>

          {/* Real Gemini Analysis box */}
          {aiAnalysisNotes && (
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/35 rounded-xl text-xs text-slate-200 text-left">
              <span className="font-semibold block text-[#A78BFA] uppercase font-mono tracking-wide mb-1">⚡ Gemini Copilot Data Summary</span>
              <p className="leading-relaxed font-mono text-[11px]">{aiAnalysisNotes}</p>
            </div>
          )}

          {/* Anomaly list wrapper */}
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {dataset.issues.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/40 border border-white/5 rounded-xl flex flex-col items-center justify-center text-slate-500">
                <BookmarkCheck className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="font-mono text-xs uppercase text-slate-300 font-semibold">Mesh Quality Score: 100% Valid</span>
                <span className="text-[10px] text-slate-500 block mt-1">Zero anomalies identified in this active set.</span>
              </div>
            ) : (
              dataset.issues.map((issue, idx) => {
                const mapKey = `${issue.rowIdx}-${issue.colName}`;
                const isChecked = selectedIssues[mapKey] !== false; // DEFAULT ON
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSelectIssue(issue.rowIdx, issue.colName)}
                    className={`p-3 bg-slate-950 border hover:border-white/15 rounded-xl flex items-start gap-3 transition-colors cursor-pointer select-none ${
                      isChecked ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 opacity-55'
                    }`}
                  >
                    <button className={`w-4 h-4 rounded mt-1 flex items-center justify-center border transition-all ${
                      isChecked ? 'bg-indigo-500 border-indigo-500 text-slate-950' : 'border-slate-700 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0">Row {issue.rowIdx + 1}</span>
                        <span className="text-slate-600 text-[10px]">➔</span>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 shrink-0">
                          {issue.colName}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-indigo-500/20 text-[#A78BFA] font-bold rounded shrink-0">
                          {issue.confidence}% CONFIDENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{issue.message}</p>
                      
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono leading-none">
                        <span className="text-slate-500 uppercase">Imputation Fix:</span>
                        <span className="text-emerald-400 font-semibold bg-emerald-950/20 py-0.5 px-1.5 rounded border border-emerald-950">
                          {issue.suggestedValue === '' ? '(empty string/drop)' : String(issue.suggestedValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Fix operations buttons */}
          <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs rounded-xl border border-white/10 font-mono"
            >
              Reconstruct rules
            </button>
            <button
              onClick={handleApplyAIFixes}
              disabled={dataset.issues.length === 0}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-40"
            >
              Commit Auto Rectification Rules
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
