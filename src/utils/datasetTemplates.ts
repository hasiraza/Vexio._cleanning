import { Dataset, CellularIssue } from '../types/data';

export const TEMPLATE_DATASETS: Dataset[] = [
  {
    id: 'ecom-leads-01',
    name: 'ecommerce_customer_leads.csv',
    sizeBytes: 124500,
    rowCount: 12,
    colCount: 6,
    qualityScore: 68,
    createdAt: '2026-06-16 10:15',
    headers: ['id', 'full_name', 'email_address', 'signup_date', 'purchase_amount', 'us_state'],
    columns: [
      { name: 'id', dataType: 'number', hasNulls: false, uniqueCount: 12 },
      { name: 'full_name', dataType: 'string', hasNulls: true, uniqueCount: 11 },
      { name: 'email_address', dataType: 'string', hasNulls: true, uniqueCount: 11 },
      { name: 'signup_date', dataType: 'datetime', hasNulls: false, uniqueCount: 12 },
      { name: 'purchase_amount', dataType: 'number', hasNulls: true, uniqueCount: 9 },
      { name: 'us_state', dataType: 'string', hasNulls: true, uniqueCount: 7 }
    ],
    rows: [
      { id: 101, full_name: 'Sarah Connor', email_address: 'sconnor@cyberdyne.com', signup_date: '2025-11-12', purchase_amount: 1250.50, us_state: 'CA' },
      { id: 102, full_name: 'john connor', email_address: 'jconnor@resistance.net', signup_date: '2025-11-14', purchase_amount: 45.00, us_state: 'ca' },
      { id: 103, full_name: 'Marcus Wright', email_address: 'mwright@skynet.com', signup_date: '2025-11-15', purchase_amount: null, us_state: 'TX' },
      { id: 104, full_name: 'Ellen Ripley', email_address: 'ripley@weyland-yutani.org', signup_date: '2025-11-18', purchase_amount: 8900.00, us_state: 'N/A' },
      { id: 105, full_name: 'peter parker', email_address: 'spidey@dailybugle.com', signup_date: '2025-11-19', purchase_amount: 15.25, us_state: 'NY' },
      { id: 106, full_name: 'Tony Stark', email_address: '', signup_date: '2025-11-20', purchase_amount: 540000.00, us_state: 'NY' },
      { id: 107, full_name: 'Bruce Banner', email_address: 'hulk@avengers.org', signup_date: '2025-11-22', purchase_amount: 120.00, us_state: 'OH' },
      { id: 108, full_name: 'Diana Prince', email_address: 'diana@themyscira.gov', signup_date: '2025-11-23', purchase_amount: null, us_state: 'FL' },
      { id: 109, full_name: 'Clark Kent', email_address: 'ckent@dailyplanet.com', signup_date: '2025-11-24', purchase_amount: 25.00, us_state: 'KS' },
      { id: 110, full_name: 'Arthur Curry', email_address: 'aquaman@atlantis.io', signup_date: '2025-11-26', purchase_amount: 350.00, us_state: 'FL' },
      { id: 111, full_name: 'Bruce Wayne', email_address: 'batman@waynecorp.com', signup_date: '2025-11-27', purchase_amount: 1500000.00, us_state: 'NJ' },
      { id: 112, full_name: null, email_address: 'anonymous@darkweb.org', signup_date: '2025-11-28', purchase_amount: 5.00, us_state: '' }
    ],
    issues: [
      { rowIdx: 1, colName: 'us_state', category: 'casing', message: 'Inconsistent state casing (ca is lowercase). Expected UPPERCASE standard.', suggestedValue: 'CA', confidence: 98, applied: false },
      { rowIdx: 2, colName: 'purchase_amount', category: 'missing', message: 'Null numeric value in Purchase column.', suggestedValue: '350.00', confidence: 85, applied: false },
      { rowIdx: 3, colName: 'us_state', category: 'anomaly', message: 'Invalid placeholder state (N/A) reported.', suggestedValue: 'NY', confidence: 71, applied: false },
      { rowIdx: 4, colName: 'full_name', category: 'casing', message: 'Improper full-name casing. Expected Title Case.', suggestedValue: 'Peter Parker', confidence: 99, applied: false },
      { rowIdx: 5, colName: 'email_address', category: 'missing', message: 'Missing client contact email address fields.', suggestedValue: 'tstark@waynecorp.com', confidence: 88, applied: false },
      { rowIdx: 5, colName: 'purchase_amount', category: 'scaling', message: 'Outlier value detected ($540,000.00), highly skewed distribution.', suggestedValue: '540000.00', confidence: 95, applied: false },
      { rowIdx: 7, colName: 'purchase_amount', category: 'missing', message: 'Null numeric value in Purchase column.', suggestedValue: '120.00', confidence: 82, applied: false },
      { rowIdx: 10, colName: 'purchase_amount', category: 'scaling', message: 'Outlier value detected ($1,500,000.00), extreme skew influencer.', suggestedValue: '1500000.00', confidence: 99, applied: false },
      { rowIdx: 11, colName: 'full_name', category: 'missing', message: 'Missing first/last customer name string.', suggestedValue: 'Darkweb User', confidence: 76, applied: false },
      { rowIdx: 11, colName: 'us_state', category: 'missing', message: 'Missing state record code.', suggestedValue: 'NY', confidence: 79, applied: false }
    ]
  },
  {
    id: 'health-metrics-02',
    name: 'clinical_biosensor_readings.xlsx',
    sizeBytes: 84300,
    rowCount: 8,
    colCount: 5,
    qualityScore: 82,
    createdAt: '2026-06-15 14:30',
    headers: ['patient_id', 'heart_rate_bpm', 'oxygen_sat', 'systolic_bp', 'smoker_group'],
    columns: [
      { name: 'patient_id', dataType: 'number', hasNulls: false, uniqueCount: 8 },
      { name: 'heart_rate_bpm', dataType: 'number', hasNulls: true, uniqueCount: 7 },
      { name: 'oxygen_sat', dataType: 'number', hasNulls: true, uniqueCount: 7 },
      { name: 'systolic_bp', dataType: 'number', hasNulls: false, uniqueCount: 8 },
      { name: 'smoker_group', dataType: 'boolean', hasNulls: true, uniqueCount: 2 }
    ],
    rows: [
      { patient_id: 1001, heart_rate_bpm: 72, oxygen_sat: 98, systolic_bp: 120, smoker_group: 'NON-SMOKER' },
      { patient_id: 1002, heart_rate_bpm: 240, oxygen_sat: 96, systolic_bp: 135, smoker_group: 'SMOKER' },
      { patient_id: 1003, heart_rate_bpm: 68, oxygen_sat: null, systolic_bp: 118, smoker_group: 'NON-SMOKER' },
      { patient_id: 1004, heart_rate_bpm: null, oxygen_sat: 99, systolic_bp: 142, smoker_group: 'unknown' },
      { patient_id: 1005, heart_rate_bpm: 80, oxygen_sat: 95, systolic_bp: 121, smoker_group: 'NON-SMOKER' },
      { patient_id: 1006, heart_rate_bpm: 75, oxygen_sat: 89, systolic_bp: 115, smoker_group: 'SMOKER' },
      { patient_id: 1007, heart_rate_bpm: 64, oxygen_sat: 97, systolic_bp: 380, smoker_group: 'NON-SMOKER' },
      { patient_id: 1008, heart_rate_bpm: 900, oxygen_sat: 99, systolic_bp: 122, smoker_group: 'NON-SMOKER' }
    ],
    issues: [
      { rowIdx: 1, colName: 'heart_rate_bpm', category: 'anomaly', message: 'Tachycardia outlier value (240 bpm) exceeds human rest margins.', suggestedValue: '75', confidence: 91, applied: false },
      { rowIdx: 2, colName: 'oxygen_sat', category: 'missing', message: 'Missing biosensor oxygen level.', suggestedValue: '97', confidence: 84, applied: false },
      { rowIdx: 3, colName: 'heart_rate_bpm', category: 'missing', message: 'Missing sensor heartbeat metrics.', suggestedValue: '72', confidence: 80, applied: false },
      { rowIdx: 3, colName: 'smoker_group', category: 'encoding', message: 'Inconsistent boolean label (unknown). Expected SMOKER/NON-SMOKER standard.', suggestedValue: 'NON-SMOKER', confidence: 92, applied: false },
      { rowIdx: 6, colName: 'systolic_bp', category: 'anomaly', message: 'Lethal hypertensive blood pressure reading (380 mmHg). Probable sensor noise.', suggestedValue: '120', confidence: 96, applied: false },
      { rowIdx: 7, colName: 'heart_rate_bpm', category: 'anomaly', message: 'Impossible biosensor reading (900 bpm). Real rest limit max is 220.', suggestedValue: '74', confidence: 99, applied: false }
    ]
  }
];
