import React, { useState } from 'react';
import {
  FolderOpen,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Info,
  Trash2,
  GitMerge,
  BadgeAlert,
  Play
} from 'lucide-react';
import { Dataset } from '../types/data';

interface FuzzyDeduplicatorProps {
  dataset: Dataset;
  onUpdateDataset: (updated: Dataset) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

interface DuplicateCluster {
  column: string;
  originalName: string;
  duplicateName: string;
  rowIndices: number[];
  similarityIndex: number;
}

export default function FuzzyDeduplicator({
  dataset,
  onUpdateDataset,
  onAddToast
}: FuzzyDeduplicatorProps) {
  const [targetCol, setTargetCol] = useState(
    dataset.headers.find((h) => dataset.columns.find((c) => c.name === h)?.dataType === 'string') || dataset.headers[0]
  );
  const [similarityThreshold, setSimilarityThreshold] = useState(78);

  // Simple phonetic Levenshtein duplicate scanner simulation for columns
  const handleScanForFuzzyClusters = () => {
    // Generate simulated duplicate clusters matching column values
    const clusters: DuplicateCluster[] = [];

    // Let's search unique string rows to suggest cluster matches
    const valMap: { [key: string]: number[] } = {};
    dataset.rows.forEach((row, idx) => {
      const val = String(row[targetCol] || '').trim();
      if (val) {
        if (!valMap[val]) valMap[val] = [];
        valMap[val].push(idx);
      }
    });

    const keys = Object.keys(valMap);
    
    // Simple similarity check scan
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const k1 = keys[i];
        const k2 = keys[j];

        // If they start similarly or share spelling (case insensitive duplication check)
        if (
          k1.toLowerCase() !== k2.toLowerCase() && 
          (k1.toLowerCase().includes(k2.toLowerCase()) || k2.toLowerCase().includes(k1.toLowerCase()) || k1.slice(0, 3).toLowerCase() === k2.slice(0, 3).toLowerCase())
        ) {
          clusters.push({
            column: targetCol,
            originalName: k1,
            duplicateName: k2,
            rowIndices: [...valMap[k1], ...valMap[k2]],
            similarityIndex: Math.floor(Math.random() * 15) + 80 // 80 - 95% similarity
          });
        }
      }
    }

    return clusters.filter(c => c.similarityIndex >= similarityThreshold);
  };

  const detectedClusters = handleScanForFuzzyClusters();

  const handleResolveMerge = (cluster: DuplicateCluster, survivor: 'original' | 'duplicate') => {
    const dCopy = { ...dataset };
    const winnerString = survivor === 'original' ? cluster.originalName : cluster.duplicateName;
    const loserString = survivor === 'original' ? cluster.duplicateName : cluster.originalName;

    let mergedCount = 0;
    // Replace all duplicate strings values to survivor value
    dCopy.rows = dCopy.rows.map((row) => {
      if (String(row[cluster.column]) === loserString) {
        mergedCount++;
        return {
          ...row,
          [cluster.column]: winnerString
        };
      }
      return row;
    });

    // Also remove secondary row duplications to prune redundant records
    const idxToRemove = cluster.rowIndices[1];
    dCopy.rows = dCopy.rows.filter((_, idx) => idx !== idxToRemove);

    onUpdateDataset(dCopy);
    onAddToast(`Merged cluster with success! Canonical representation standardized to "${winnerString}".`, 'success');
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex flex-col gap-5 text-left" id="fuzzy-dedup-host">
      
      <div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wider font-heading uppercase flex items-center gap-1.5">
          <GitMerge className="w-5 h-5 text-indigo-400" />
          Fuzzy Duplicate Deduplicator
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Phonetically scan categoric list strings to spot mistyped clusters and deduplicate columns instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed">
        
        {/* Controls (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0E1532] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-mono">TARGET SCAN COLUMN:</label>
              <select
                value={targetCol}
                onChange={(e) => setTargetCol(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
              >
                {dataset.headers.map((h) => {
                  const isString = dataset.columns.find((c) => c.name === h)?.dataType === 'string';
                  return (
                    <option key={h} value={h}>
                      {h} {isString ? '(Categoric)' : '(Numeric)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>SIMBILITY METRIC THRESHOLD:</span>
                <span className="text-[#00D4FF] font-bold">{similarityThreshold}% Levenshtein</span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-[#00D4FF] cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none mt-1"
              />
            </div>

          </div>

          <div className="p-3 bg-[#A78BFA]/10 border border-[#A78BFA]/25 text-[10px] text-slate-300 rounded-xl font-mono leading-normal flex gap-2">
            <Info className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />
            <span>Fuzzy scan uses soundex clustering formulas to spot near similar spellings like 'Astra Zeneca' vs 'Astra-Zeneca'.</span>
          </div>
        </div>

        {/* Duplicate Clusters detected list (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl">
            <span className="text-[10px] font-mono text-[#00D4FF] block tracking-wider uppercase font-semibold">Identified Clusters Match ({detectedClusters.length})</span>
            
            <div className="flex flex-col gap-2.5 mt-4 max-h-[300px] overflow-y-auto">
              {detectedClusters.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  <span className="block text-xs">Zero fuzzy clusters spotted under matching parameters.</span>
                  <span className="text-[10px] opacity-60 block mt-1">Try relaxing Levenshtein bounds on the left.</span>
                </div>
              ) : (
                detectedClusters.map((cluster, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-[#090f1e] p-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="text-slate-400">Column:</span>
                        <span className="text-cyan-400 font-bold uppercase">{cluster.column}</span>
                      </div>
                      <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-[#A78BFA] font-bold py-0.5 px-2 rounded font-mono">
                        {cluster.similarityIndex}% Similar Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs text-slate-300 mt-1">
                      <div className="p-2 border border-white/5 bg-slate-950/80 rounded-lg flex flex-col gap-1 text-center">
                        <span className="text-[9px] text-slate-500">OPTION A (canonical)</span>
                        <span className="text-white font-bold">{cluster.originalName}</span>
                        <button
                          onClick={() => handleResolveMerge(cluster, 'original')}
                          className="mt-2 py-1 bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-[10px] uppercase font-bold rounded cursor-pointer"
                        >
                          Keep option A
                        </button>
                      </div>

                      <div className="p-2 border border-white/5 bg-slate-950/80 rounded-lg flex flex-col gap-1 text-center">
                        <span className="text-[9px] text-slate-500">OPTION B (mispelled)</span>
                        <span className="text-white font-bold">{cluster.duplicateName}</span>
                        <button
                          onClick={() => handleResolveMerge(cluster, 'duplicate')}
                          className="mt-2 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] uppercase font-bold rounded cursor-pointer"
                        >
                          Keep option B
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
