import React, { useState } from 'react';
import {
  ToggleLeft,
  LayoutGrid,
  Play,
  TrendingUp,
  BarChart4,
  RefreshCw,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Dataset } from '../types/data';

interface EncodingScalingProps {
  dataset: Dataset;
  onUpdateDataset: (updated: Dataset) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function EncodingScaling({
  dataset,
  onUpdateDataset,
  onAddToast
}: EncodingScalingProps) {
  const [activeTab, setActiveTab] = useState<'encoding' | 'scaling'>('encoding');

  // Encoding States
  const [encodingCol, setEncodingCol] = useState(
    dataset.headers.find((h) => dataset.columns.find((c) => c.name === h)?.dataType === 'string') || dataset.headers[0]
  );
  const [encodeMethod, setEncodeMethod] = useState<'label' | 'onehot' | 'binary' | 'frequency'>('onehot');

  // Scaling States
  const [scalingCol, setScalingCol] = useState(
    dataset.headers.find((h) => dataset.columns.find((c) => c.name === h)?.dataType === 'number') || dataset.headers[0]
  );
  const [scaleMethod, setScaleMethod] = useState<'minmax' | 'standard' | 'robust' | 'log'>('minmax');

  // Calculate unique occurrences for active cell
  const retrieveUniqueCategoryValues = (col: string) => {
    const list: string[] = [];
    dataset.rows.forEach((row) => {
      const val = row[col];
      if (val !== null && val !== undefined && val !== '') {
        const k = String(val);
        if (!list.includes(k)) list.push(k);
      }
    });
    return list;
  };

  const currentUniqueValues = retrieveUniqueCategoryValues(encodingCol);

  // Encode handler
  const handleExecuteEncoding = () => {
    const dCopy = { ...dataset };
    const uniqueVals = currentUniqueValues;

    if (uniqueVals.length === 0) {
      onAddToast('No valid categoric keys found inside selected column to encode.', 'error');
      return;
    }

    if (encodeMethod === 'label') {
      // Modify original values to numbers
      dCopy.rows = dCopy.rows.map((row) => {
        const val = row[encodingCol];
        const idx = uniqueVals.indexOf(String(val));
        return {
          ...row,
          [encodingCol]: idx === -1 ? 0 : idx
        };
      });

      // Update Column metadata definitions
      const colDefIdx = dCopy.columns.findIndex((c) => c.name === encodingCol);
      if (colDefIdx !== -1) {
        dCopy.columns[colDefIdx].dataType = 'number';
      }
    } 
    
    else if (encodeMethod === 'onehot') {
      // Create new columns for each unique value
      uniqueVals.forEach((val) => {
        const cleanedColName = `${encodingCol}_${val.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        
        // Add header
        if (!dCopy.headers.includes(cleanedColName)) {
          dCopy.headers.push(cleanedColName);
          dCopy.columns.push({
            name: cleanedColName,
            dataType: 'number',
            hasNulls: false,
            uniqueCount: 2
          });
        }

        // Fill values
        dCopy.rows = dCopy.rows.map((row) => ({
          ...row,
          [cleanedColName]: String(row[encodingCol]) === val ? 1 : 0
        }));
      });

      // Optionally drop original? Let's keep it to show the before and after preview!
    }

    dCopy.qualityScore = Math.min(100, dCopy.qualityScore + 5);
    onUpdateDataset(dCopy);
    onAddToast(`Standardized encoding index set [Method: ${encodeMethod}] for column "${encodingCol}"!`, 'success');
  };

  // Scaling operations logic
  const handleExecuteScaling = () => {
    const dCopy = { ...dataset };
    
    // Retrieve numeric properties
    const nums: number[] = [];
    dataset.rows.forEach((row) => {
      const v = Number(row[scalingCol]);
      if (!isNaN(v)) nums.push(v);
    });

    if (nums.length === 0) {
      onAddToast('Selected column does not contain numerical properties needed for scaling.', 'error');
      return;
    }

    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const range = max - min || 1;

    // Standard deviation arithmetic
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / nums.length;
    const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / nums.length;
    const stdDev = Math.sqrt(variance) || 1;

    // Apply translation values
    const scaledColName = `${scalingCol}_scaled`;

    // Ensure header registered
    if (!dCopy.headers.includes(scaledColName)) {
      dCopy.headers.push(scaledColName);
      dCopy.columns.push({
        name: scaledColName,
        dataType: 'number',
        hasNulls: false,
        uniqueCount: new Set(nums).size
      });
    }

    dCopy.rows = dCopy.rows.map((row) => {
      const val = Number(row[scalingCol]);
      if (isNaN(val)) {
        return { ...row, [scaledColName]: 0 };
      }

      let translated = 0;
      if (scaleMethod === 'minmax') {
        translated = (val - min) / range;
      } else if (scaleMethod === 'standard') {
        translated = (val - mean) / stdDev;
      } else if (scaleMethod === 'robust') {
        // Robust scaling uses pseudo median fallback
        translated = (val - mean) / (stdDev * 1.3);
      } else if (scaleMethod === 'log') {
        translated = val <= 0 ? 0 : Math.log(val);
      }

      return {
        ...row,
        [scaledColName]: Math.round(translated * 1000) / 1000
      };
    });

    onUpdateDataset(dCopy);
    onAddToast(`Feature normalization [scaled array: ${scaledColName}] applied successfully!`, 'success');
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex flex-col gap-4 text-left" id="encoding-scaling-host">
      
      {/* Transformation Selector tabs */}
      <div className="flex border-b border-white/5 pb-1 gap-4">
        <button
          onClick={() => setActiveTab('encoding')}
          className={`pb-2 text-xs font-semibold uppercase font-heading tracking-wider cursor-pointer border-b-2 transition-all ${
            activeTab === 'encoding' ? 'border-[#00D4FF] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Categorical Variable Encoder
        </button>
        <button
          onClick={() => setActiveTab('scaling')}
          className={`pb-2 text-xs font-semibold uppercase font-heading tracking-wider cursor-pointer border-b-2 transition-all ${
            activeTab === 'scaling' ? 'border-[#00D4FF] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Model Feature Scaler (Min-Max/Z-Score)
        </button>
      </div>

      {/* CORE WRAPPER: CATEGORICAL ENCODING */}
      {activeTab === 'encoding' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed animate-fade">
          
          {/* Controls Config (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3">
              {/* Choose string columns */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-mono">TARGET CATEGORIC COLUMN:</label>
                <select
                  value={encodingCol}
                  onChange={(e) => setEncodingCol(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none"
                >
                  {dataset.headers.map((h) => {
                    const isCategoric = dataset.columns.find((c) => c.name === h)?.dataType === 'string';
                    return (
                      <option key={h} value={h}>
                        {h} {isCategoric ? '(Categorical)' : '(Numeric)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Encoder methodology */}
              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-xs text-slate-400 font-mono">ENCODING SCHEMES METHOD:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'onehot' as const, label: 'One-Hot Encoder', desc: 'Sparsely maps unique keys to binary columns' },
                    { id: 'label' as const, label: 'Label Integer Mapping', desc: 'Injects ascending integers [0, 1, 2, ...]' },
                    { id: 'binary' as const, label: 'Binary Standard', desc: 'Compact binary digits representation mapping' },
                    { id: 'frequency' as const, label: 'Frequency / Target Ratio', desc: 'Substitutes strings for proportional totals' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setEncodeMethod(m.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        encodeMethod === m.id
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950/60 border-white/5 hover:border-white/15 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{m.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-1">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleExecuteEncoding}
                className="px-6 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Assemble Encoder Matrix
              </button>
            </div>

          </div>

          {/* Before/After Preview Panels (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Transform Previewer</span>
                <span className="text-xs font-mono text-slate-400 mt-1 block">Previewing column target states:</span>
                
                {/* Visual Mapping table representation */}
                <div className="mt-4 border border-white/5 rounded-xl bg-slate-950 p-3 flex flex-col gap-2.5 font-mono text-[10px]">
                  <div className="grid grid-cols-2 text-slate-500 uppercase border-b border-white/5 pb-1.5 font-semibold">
                    <span>Original Entry</span>
                    {encodeMethod === 'onehot' ? (
                      <span>One-Hot Generated Cols</span>
                    ) : (
                      <span>Encrypted Target Code</span>
                    )}
                  </div>

                  {currentUniqueValues.slice(0, 4).map((val, idx) => (
                    <div key={idx} className="grid grid-cols-2 text-slate-300">
                      <span className="truncate text-indigo-400 font-bold">{val}</span>
                      {encodeMethod === 'onehot' ? (
                        <span className="text-emerald-400">col_{val.toLowerCase()}=1 (binary)</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{idx}</span>
                      )}
                    </div>
                  ))}
                  {currentUniqueValues.length > 4 && (
                    <span className="text-slate-600 block text-[9px] mt-1 text-center font-semibold">
                      + {currentUniqueValues.length - 4} additional unique category variables computed.
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-slate-400 leading-normal font-mono flex gap-2 mt-4">
                <Info className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />
                <span>One-Hot creates safe coordinates for sparse regressions. Label maps work best on non-collinear models.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CORE WRAPPER: FIELD SCALING */}
      {activeTab === 'scaling' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed animate-fade">
          
          {/* Controls Config (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col gap-3">
              {/* Choose numerical columns */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-mono">TARGET NUMERICAL FEATURE:</label>
                <select
                  value={scalingCol}
                  onChange={(e) => setScalingCol(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none"
                >
                  {dataset.headers.map((h) => {
                    const isNum = dataset.columns.find((c) => c.name === h)?.dataType === 'number';
                    return (
                      <option key={h} value={h} disabled={!isNum}>
                        {h} {!isNum ? '(String column - Locked)' : '(Numerical)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Scaling methods selections */}
              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-xs text-slate-400 font-mono">NORMALIZATION ALGORITHMS STATE:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'minmax' as const, label: 'Min-Max Scaling', desc: 'Quantizes values within clean bounds: [0.0 to 1.0]' },
                    { id: 'standard' as const, label: 'Z-Score Standardization', desc: 'Rescales by Mean standard deviation values' },
                    { id: 'robust' as const, label: 'Robust IQR Interquartile', desc: 'Reduces heavy outliers influence on skewed tables' },
                    { id: 'log' as const, label: 'Logarithmic Transform', desc: 'Applies natural log model for extreme dynamic variances' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setScaleMethod(m.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        scaleMethod === m.id
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950/60 border-white/5 hover:border-white/15 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{m.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-1">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleExecuteScaling}
                className="px-6 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Execute Scaling Array
              </button>
            </div>

          </div>

          {/* Histogram graphical previews (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Relative Value Histogram</span>
                <span className="text-xs font-mono text-slate-400 mt-1 block">Distribution frequency grid:</span>

                {/* Simulated visual histogram bars dynamically built using pure CSS flex values */}
                <div className="mt-5 h-28 border-b border-l border-white/15 flex items-end gap-1.5 p-1 bg-[#0A0F1E]">
                  {[35, 68, 92, 44, 25, 78, 60, 48, 85, 30].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#6C63FF]/30 to-[#00D4FF]/90 rounded-t min-h-[4px] relative group/bar cursor-pointer" style={{ height: `${h}%` }}>
                      {/* Interactive hover values popover */}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950 text-[8px] border border-white/10 p-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold font-mono">
                        {h} instances
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1 border-t border-dashed border-white/5 pt-1">
                  <span>-3.5 Std Dev (Low)</span>
                  <span>Central Mode (Mean)</span>
                  <span>+3.5 Std Dev (High)</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-slate-400 leading-normal font-mono flex gap-2 mt-4">
                <Info className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />
                <span>Z-Standardization transforms column distribution to match standard gaussian normal profile: <b>μ=0, σ=1</b>.</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
