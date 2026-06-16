import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Search,
  RotateCcw,
  RotateCw,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
  Filter,
  Save,
  Download,
  Info
} from 'lucide-react';
import { Dataset, CellularIssue } from '../types/data';

interface SpreadsheetEditorProps {
  dataset: Dataset;
  onUpdateDataset: (updated: Dataset) => void;
  onAddToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function SpreadsheetEditor({
  dataset,
  onUpdateDataset,
  onAddToast
}: SpreadsheetEditorProps) {
  // Navigation filter/search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCol, setActiveFilterCol] = useState<string>('ALL');

  // Cell Double Click Inline edit states
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; colName: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Column Sort logic
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Undo/Redo stack history arrays
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Push dataset state snapshot onto our undoStack before making operations
  const pushUndoSnapshot = (targetDataset: Dataset) => {
    const rawJsonStr = JSON.stringify(targetDataset);
    setUndoStack((prev) => [...prev, rawJsonStr]);
    setRedoStack([]); // Clear redo
  };

  const executeUndo = () => {
    if (undoStack.length === 0) {
      onAddToast('No historical action logs to revert.', 'warning');
      return;
    }
    const previousSnapshotStr = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    
    // Save current as redo
    setRedoStack((prev) => [...prev, JSON.stringify(dataset)]);
    setUndoStack(newUndoStack);

    const previousDataset = JSON.parse(previousSnapshotStr) as Dataset;
    onUpdateDataset(previousDataset);
    onAddToast('Reverted cell modification.', 'info');
  };

  const executeRedo = () => {
    if (redoStack.length === 0) {
      onAddToast('Redo stack empty.', 'warning');
      return;
    }
    const nextSnapshotStr = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    // Save current as undo
    setUndoStack((prev) => [...prev, JSON.stringify(dataset)]);
    setRedoStack(newRedoStack);

    const nextDataset = JSON.parse(nextSnapshotStr) as Dataset;
    onUpdateDataset(nextDataset);
    onAddToast('Re-applied cell modification.', 'info');
  };

  // Cell level editor action submit
  const handleStartEdit = (rowIdx: number, colName: string, initialVal: any) => {
    setEditingCell({ rowIdx, colName });
    setEditingValue(initialVal === null ? '' : String(initialVal));
  };

  const handleSaveCellEdit = (rowIdx: number, colName: string) => {
    if (editingCell) {
      pushUndoSnapshot(dataset);

      const dCopy = { ...dataset };
      
      // Attempt numerical cast where column standard calls it type: number
      const targetColDef = dCopy.columns.find((c) => c.name === colName);
      let parsedValue: any = editingValue;
      
      if (targetColDef?.dataType === 'number') {
        if (editingValue === '') {
          parsedValue = null;
        } else if (!isNaN(Number(editingValue))) {
          parsedValue = Number(editingValue);
        }
      }

      dCopy.rows[rowIdx][colName] = parsedValue;

      // Realtime Quality Score dynamic adjustment
      // If the cell was null and now filled, we clear any issue in that row
      const beforeIssueIndex = dCopy.issues.findIndex(
        (i) => i.rowIdx === rowIdx && i.colName === colName
      );

      if (beforeIssueIndex !== -1) {
        dCopy.issues.splice(beforeIssueIndex, 1);
        dCopy.qualityScore = Math.min(100, dCopy.qualityScore + 4);
      }

      onUpdateDataset(dCopy);
      setEditingCell(null);
      onAddToast(`Cell modified block: [Row ${rowIdx + 1}, ${colName}] changed to "${parsedValue}"`, 'success');
    }
  };

  // Add row
  const handleAddNewRow = () => {
    pushUndoSnapshot(dataset);
    const dCopy = { ...dataset };
    const emptyObj: Record<string, any> = {};
    dCopy.headers.forEach((h) => {
      emptyObj[h] = h === 'id' ? dCopy.rows.length + 101 : '';
    });
    dCopy.rows.push(emptyObj);
    onUpdateDataset(dCopy);
    onAddToast(`Appended blank cell record Row #${dCopy.rows.length}`, 'success');
  };

  // Delete active row
  const handleDeleteRow = (idxToDel: number) => {
    pushUndoSnapshot(dataset);
    const dCopy = { ...dataset };
    dCopy.rows = dCopy.rows.filter((_, idx) => idx !== idxToDel);
    
    // Also shift any issues referenced in rows
    dCopy.issues = dCopy.issues
      .filter((i) => i.rowIdx !== idxToDel)
      .map((i) => {
        if (i.rowIdx > idxToDel) {
          return { ...i, rowIdx: i.rowIdx - 1 };
        }
        return i;
      });

    onUpdateDataset(dCopy);
    onAddToast(`Purged horizontal record Row #${idxToDel + 1}`, 'warning');
  };

  // Column Sort handlers
  const handleRequestSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Apply sorting configuration on copy of row set
  const retrieveProcessedRows = () => {
    let rowsCopy = [...dataset.rows];

    // 1. Text Search Filter matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rowsCopy = rowsCopy.filter((row) =>
        dataset.headers.some((h) => String(row[h] || '').toLowerCase().includes(q))
      );
    }

    // 2. Active column filter matching
    if (activeFilterCol !== 'ALL') {
      rowsCopy = rowsCopy.filter(
        (row) => row[activeFilterCol] === null || row[activeFilterCol] === ''
      );
    }

    // 3. Sorting Execution
    if (sortConfig !== null) {
      rowsCopy.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rowsCopy;
  };

  const processedRows = retrieveProcessedRows();

  // Export dataset handler
  const handleTriggerExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [dataset.headers.join(",")]
        .concat(dataset.rows.map(row => dataset.headers.map(h => `"${row[h] || ''}"`).join(",")))
        .join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vexio_clean_${dataset.name || 'dataset.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast('Exported clean CSV directly to browser downloads system.', 'success');
  };

  return (
    <div className="bg-[#0E1532] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-left" id="table-workbench">
      
      {/* Search, Filter menu & Undo/Redo bars */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        
        {/* Core Search input */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table values..."
              className="w-full bg-[#0A0F1E] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Missing column filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeFilterCol}
              onChange={(e) => setActiveFilterCol(e.target.value)}
              className="bg-[#0A0F1E] border border-white/5 py-2.5 px-3 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="ALL">Show All Rows</option>
              {dataset.headers.map((h) => (
                <option key={h} value={h}>Only show Nulls in {h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          
          {/* Undo Button */}
          <button
            onClick={executeUndo}
            disabled={undoStack.length === 0}
            className="p-2 py-2.5 px-3 bg-[#0A0F1E] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent flex gap-1 items-center cursor-pointer"
            title="Revert previous cell update"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo ({undoStack.length})
          </button>

          {/* Redo Button */}
          <button
            onClick={executeRedo}
            disabled={redoStack.length === 0}
            className="p-2 py-2.5 px-3 bg-[#0A0F1E] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent flex gap-1 items-center cursor-pointer"
            title="Redistribute previous cell update"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Redo
          </button>

          {/* Add Row Button */}
          <button
            onClick={handleAddNewRow}
            className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Insert Row
          </button>

          {/* Clean Export Download */}
          <button
            onClick={handleTriggerExport}
            className="p-2.5 bg-[#00D4FF] hover:bg-[#00cceb] text-slate-950 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
          >
            <Download className="w-4 h-4" />
            Download Clean CSV
          </button>
        </div>

      </div>

      {/* Spreadsheet grid scroll core wrapper */}
      <div className="overflow-x-auto border border-white/5 rounded-xl bg-[#0A0F1E] shadow-inner max-h-[440px]">
        <table className="w-full text-xs font-mono border-collapse">
          
          {/* Table Headers */}
          <thead>
            <tr className="bg-slate-950/40 text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
              <th className="py-3 px-4 text-center w-12 border-r border-white/5">#</th>
              {dataset.headers.map((h) => {
                const isFiltered = activeFilterCol === h;
                return (
                  <th
                    key={h}
                    onClick={() => handleRequestSort(h)}
                    className={`py-3 px-4 text-left select-none relative group border-r border-white/5 transition-colors cursor-pointer ${
                      isFiltered ? 'bg-indigo-950/20 text-[#A78BFA]' : 'hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-semibold">{h}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                    </div>
                  </th>
                );
              })}
              <th className="py-3 px-4 text-center w-16">Mesh</th>
            </tr>
          </thead>

          {/* Table rows listing */}
          <tbody className="divide-y divide-white/5">
            {processedRows.length === 0 ? (
              <tr>
                <td colSpan={dataset.headers.length + 2} className="py-12 text-center text-slate-500">
                  <span className="block text-sm">No valid records matched the filter criteria search</span>
                  <span className="text-[10px] opacity-60 block mt-1">Try resetting the columns dropdown key.</span>
                </td>
              </tr>
            ) : (
              processedRows.map((row, rowIdx) => {
                // Find true actual element index inside unfiltered layout
                const realIndex = dataset.rows.findIndex((r) => r === row);
                return (
                  <tr
                    key={rowIdx}
                    className="hover:bg-[#0E1532]/40 transition-colors group/row"
                  >
                    {/* Index count cell */}
                    <td className="py-2 px-3 text-center text-slate-600 font-bold border-r border-white/5 bg-slate-950/20 select-none">
                      {realIndex + 1}
                    </td>

                    {/* Columns row map */}
                    {dataset.headers.map((h) => {
                      const value = row[h];
                      const isEditing = editingCell?.rowIdx === realIndex && editingCell?.colName === h;
                      
                      // Check if cell is currently flagged as an active issue
                      const anomalyIssue = dataset.issues.find(
                        (i) => i.rowIdx === realIndex && i.colName === h
                      );

                      const isNull = value === null || value === undefined || value === '';

                      return (
                        <td
                          key={h}
                          onDoubleClick={() => handleStartEdit(realIndex, h, value)}
                          className={`py-2.5 px-4 truncate border-r border-white/5 transition-all relative ${
                            isEditing 
                              ? 'p-1 bg-[#0D1530]' 
                              : anomalyIssue 
                              ? 'bg-amber-500/10 text-amber-300 font-bold' 
                              : isNull 
                              ? 'bg-red-500/5 text-slate-600 italic' 
                              : 'text-slate-300'
                          }`}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={() => handleSaveCellEdit(realIndex, h)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCellEdit(realIndex, h);
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              autoFocus
                              className="w-full bg-[#0A0F1E] border border-cyan-400 text-xs py-1 px-2 font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center justify-between gap-2 group/cell">
                              <span className="truncate">{isNull ? 'N/A' : String(value)}</span>
                              
                              {/* Trigger inline click indicators */}
                              {anomalyIssue && !isEditing && (
                                <span className="p-0.5 bg-amber-500/20 text-amber-500 rounded text-[9px] font-bold tracking-wide flex-shrink-0 animate-pulse">
                                  Anomaly Detected
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Trash delete record actions */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteRow(realIndex)}
                        className="opacity-0 group-hover/row:opacity-100 p-1 hover:bg-red-500/15 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer"
                        title="Delete this record row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
        <Info className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
        <div>
          <span className="font-semibold block text-slate-300 uppercase font-mono mb-0.5">Spreadsheet Interactive Guide</span>
          <p>
            Double-click any cell to activate <span className="text-white font-bold font-mono">Inline Cell Editor Mode</span>. Press <span className="text-white font-bold font-mono">[Enter]</span> to automatically validate & append modified data metrics to the state cache.
          </p>
        </div>
      </div>

    </div>
  );
}
