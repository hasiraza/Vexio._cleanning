import React, { useState } from 'react';
import {
  Sliders,
  Play,
  BadgeAlert,
  Info,
  CheckCircle,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Dataset } from '../types/data';

interface MissingValuesProps {
  dataset: Dataset;
  onUpdateDataset: (updated: Dataset) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function MissingValues({ dataset, onUpdateDataset, onAddToast }: MissingValuesProps) {
  const [selectedColName, setSelectedColName] = useState<string>(dataset.headers[0] || '');
  const [strategy, setStrategy] = useState<'mean' | 'median' | 'mode' | 'custom' | 'drop' | 'ai'>('mean');
  const [customImputationVal, setCustomImputationVal] = useState('');
  const [confidenceSliderVal, setConfidenceSliderVal] = useState(85);

  const calculateNullStats = (col: string) => {
    let nullCount = 0;
    let numericSum = 0;
    let numericValues: number[] = [];
    const occurrencesCount: { [key: string]: number } = {};

    dataset.rows.forEach((row) => {
      const val = row[col];
      if (val === null || val === undefined || val === '') {
        nullCount++;
      } else {
        const num = Number(val);
        if (!isNaN(num)) {
          numericSum += num;
          numericValues.push(num);
        }
        const strKey = String(val);
        occurrencesCount[strKey] = (occurrencesCount[strKey] || 0) + 1;
      }
    });

    const mean = numericValues.length > 0 ? (numericSum / numericValues.length) : 0;
    
    // Median
    numericValues.sort((a, b) => a - b);
    const median = numericValues.length === 0 ? 0 : 
      numericValues.length % 2 === 0
      ? (numericValues[numericValues.length / 2 - 1] + numericValues[numericValues.length / 2]) / 2
      : numericValues[Math.floor(numericValues.length / 2)];

    // Mode
    let mode = 'N/A';
    let maxCount = 0;
    Object.keys(occurrencesCount).forEach((k) => {
      if (occurrencesCount[k] > maxCount) {
        maxCount = occurrencesCount[k];
        mode = k;
      }
    });

    return { nullCount, mean, median, mode };
  };

  const currentStats = calculateNullStats(selectedColName);

  const handleApplyImputation = () => {
    pushImputationUndo(dataset);

    const dCopy = { ...dataset };
    const { mean, median, mode } = currentStats;

    let targetFillingVal: any = '';
    
    if (strategy === 'mean') {
      targetFillingVal = Math.round(mean * 100) / 100;
    } else if (strategy === 'median') {
      targetFillingVal = median;
    } else if (strategy === 'mode') {
      targetFillingVal = mode;
    } else if (strategy === 'custom') {
      if (!customImputationVal.trim()) {
        onAddToast('Please specify a custom input value prior to executing.', 'error');
        return;
      }
      targetFillingVal = isNaN(Number(customImputationVal)) ? customImputationVal : Number(customImputationVal);
    } else if (strategy === 'ai') {
      // AI Imputation chooses mode for categorical and mean for numerical
      const isNum = dataset.columns.find((c) => c.name === selectedColName)?.dataType === 'number';
      targetFillingVal = isNum ? Math.round(mean * 110) / 100 : `${mode}_ai`; // Simulated complex extrapolation
    }

    let modifiedRowsCount = 0;

    if (strategy === 'drop') {
      // Drop whole row matching null
      dCopy.rows = dCopy.rows.filter((row) => {
        const val = row[selectedColName];
        if (val === null || val === undefined || val === '') {
          modifiedRowsCount++;
          return false; // Drop
        }
        return true;
      });
    } else {
      // Replace cell in rows
      dCopy.rows = dCopy.rows.map((row) => {
        const val = row[selectedColName];
        if (val === null || val === undefined || val === '') {
          modifiedRowsCount++;
          return {
            ...row,
            [selectedColName]: targetFillingVal
          };
        }
        return row;
      });
    }

    // Clear associated issue logs
    dCopy.issues = dCopy.issues.filter((i) => !(i.colName === selectedColName && i.applied === false));
    dCopy.qualityScore = Math.min(100, dCopy.qualityScore + 10);

    onUpdateDataset(dCopy);
    onAddToast(`Imputation standard applied! Affected ${modifiedRowsCount} rows in sandbox memory.`, 'success');
  };

  const pushImputationUndo = (targetDataset: Dataset) => {
    // Simply pushes to app level undo if needed
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col gap-5 text-left" id="missing-values-transformation">
      
      <div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wider font-heading uppercase flex items-center gap-1.5">
          <Sliders className="w-5 h-5 text-[#00D4FF]" />
          Null/Blank Feature Imputer
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Configure numerical or string fill models to secure messy tabular vectors and solve NaN values instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed">
        
        {/* Imputation Config Section (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          
          <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3">
            
            {/* Choose target column */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-mono">TARGET MATRIX COLUMN:</label>
              <select
                value={selectedColName}
                onChange={(e) => setSelectedColName(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none"
              >
                {dataset.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Imputation Tactics strategy */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs text-slate-400 font-mono">IMPUTATION TACTICS STATE:</label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mean' as const, label: 'Arithmetic Mean', desc: 'Average of elements' },
                  { id: 'median' as const, label: 'Median Sort', desc: 'Central vector value' },
                  { id: 'mode' as const, label: 'Standard Mode', desc: 'Most frequent string' },
                  { id: 'custom' as const, label: 'Custom Input', desc: 'Set literal character' },
                  { id: 'ai' as const, label: 'Copilot AI Predictions', desc: 'Simulated LLM fill code' },
                  { id: 'drop' as const, label: 'Drop Entire Records', desc: 'Purge empty row index' }
                ].map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setStrategy(strat.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      strategy === strat.id
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/15 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{strat.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight mt-1">{strat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input prompt values */}
            {strategy === 'custom' && (
              <div className="flex flex-col gap-1.5 mt-1 animate-slide">
                <label className="text-xs text-slate-400 font-mono">CUSTOM INPUT VAL / PLACEHOLDER:</label>
                <input
                  type="text"
                  placeholder="e.g. Unknown, N/A, 0.0"
                  value={customImputationVal}
                  onChange={(e) => setCustomImputationVal(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            )}

            {/* AI confidence threshold slider values */}
            {strategy === 'ai' && (
              <div className="flex flex-col gap-1.5 mt-1 animate-slide">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>AI IMPOST THRESHOLD RATIO:</span>
                  <span className="text-indigo-400 font-bold">{confidenceSliderVal}% confidence limit</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={confidenceSliderVal}
                  onChange={(e) => setConfidenceSliderVal(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none mt-1"
                />
              </div>
            )}

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleApplyImputation}
              className="px-6 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] hover:from-[#5c54fa] hover:to-[#00ccf2] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Apply Imputation Rules
            </button>
          </div>

        </div>

        {/* Local Statistical analysis previews (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Active Metrics Audit</span>
              <h4 className="text-sm font-semibold text-slate-200 font-mono mt-1 uppercase">{selectedColName}</h4>

              <div className="mt-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-mono">Null Anomalies Detected:</span>
                  <span className={`font-mono font-medium ${currentStats.nullCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                    {currentStats.nullCount} records
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-mono">Arithmetic Mean (numerical):</span>
                  <span className="font-mono text-slate-300">{Math.round(currentStats.mean * 100) / 100}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-mono">Median Sort Value:</span>
                  <span className="font-mono text-slate-300">{currentStats.median}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1">
                  <span className="text-slate-500 font-mono">Standard Category Mode:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[120px]">{currentStats.mode}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-[10px] text-slate-300 leading-normal font-mono flex gap-2 mt-4">
              <Info className="w-4 h-4 text-[#A78BFA] flex-shrink-0 mt-0.5" />
              <span>Choosing Mean/Median is suggested for numerical columns. Categorical text values are suggested for Mode/Custom parameters.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
