export interface Violation {
  id: string;
  assetName: string;
  platform: string;
  matchScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'Review';
  detectedOn: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Processing';
  thumbnail?: string;
  url?: string;
  matchType?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  accent?: 'blue' | 'rose' | 'emerald' | 'slate';
}

export interface AnalyticsData {
  name: string;
  value: number;
}
