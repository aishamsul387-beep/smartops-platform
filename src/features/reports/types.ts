export type ReportKind =
  | 'inventory-summary'
  | 'stock-alerts'
  | 'warehouse-utilization'
  | 'procurement-overview';

export interface ReportMetric {
  label: string;
  value: number;
  helperText?: string;
}

export interface ReportRowDto {
  id: string;
  reportName: string;
  reportKind: ReportKind;
  generatedAt: string;
  owner: string;
  status: 'ready' | 'processing';
}

export interface ReportRow {
  id: string;
  reportName: string;
  reportKind: ReportKind;
  reportKindLabel: string;
  generatedAt: string;
  owner: string;
  status: 'ready' | 'processing';
  statusLabel: string;
}

export interface ReportsFilters {
  search?: string;
  kind?: ReportKind | 'all';
}

export interface ReportsDashboardData {
  metrics: ReportMetric[];
  rows: ReportRow[];
}