/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeverityType = 'warning' | 'critical' | 'fatal';
export type IssueCategoryType = 'missing' | 'encoding' | 'scaling' | 'anomaly' | 'duplicate' | 'casing' | 'format';

export interface CellularIssue {
  rowIdx: number;
  colName: string;
  category: IssueCategoryType;
  message: string;
  suggestedValue: string;
  confidence: number; // percentage eg. 92
  applied: boolean;
}

export interface DatasetColumn {
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'datetime';
  hasNulls: boolean;
  uniqueCount: number;
  sampleSuggestion?: string;
}

export interface Dataset {
  id: string;
  name: string;
  sizeBytes: number;
  rowCount: number;
  colCount: number;
  columns: DatasetColumn[];
  headers: string[];
  rows: Record<string, any>[];
  issues: CellularIssue[];
  qualityScore: number; // 0 to 100
  createdAt: string;
}

export interface SavedAnalysis {
  id: string;
  datasetName: string;
  issuesDetected: number;
  issuesFixed: number;
  initialQuality: number;
  finalQuality: number;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  plan: 'Free' | 'Professional' | 'Enterprise';
  apiKey: string;
}

export interface ActiveToast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
