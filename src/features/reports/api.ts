import type { ReportMetric, ReportRowDto, ReportsDashboardData, ReportsFilters } from './types';
import { mapReportRow } from './mapper';

const MOCK_REPORT_METRICS: ReportMetric[] = [
  {
    label: 'Generated reports',
    value: 12,
    helperText: 'Ready for export wiring later'
  },
  {
    label: 'Stock alerts',
    value: 4,
    helperText: 'Low and out-of-stock focus'
  },
  {
    label: 'Warehouse utilization',
    value: 68,
    helperText: 'Average utilization percentage'
  },
  {
    label: 'Procurement pending',
    value: 3,
    helperText: 'PO / GRN follow-up'
  }
];

const MOCK_REPORT_ROWS: ReportRowDto[] = [
  {
    id: 'rep-001',
    reportName: 'Inventory Summary - Main Warehouse',
    reportKind: 'inventory-summary',
    generatedAt: '2026-05-22T08:30:00.000Z',
    owner: 'Admin User',
    status: 'ready'
  },
  {
    id: 'rep-002',
    reportName: 'Critical Stock Alerts',
    reportKind: 'stock-alerts',
    generatedAt: '2026-05-22T09:00:00.000Z',
    owner: 'Manager User',
    status: 'ready'
  },
  {
    id: 'rep-003',
    reportName: 'Warehouse Utilization Snapshot',
    reportKind: 'warehouse-utilization',
    generatedAt: '2026-05-22T10:15:00.000Z',
    owner: 'Operator User',
    status: 'processing'
  },
  {
    id: 'rep-004',
    reportName: 'Procurement Overview Weekly',
    reportKind: 'procurement-overview',
    generatedAt: '2026-05-22T11:20:00.000Z',
    owner: 'Admin User',
    status: 'ready'
  }
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesSearch(values: string[], search?: string) {
  if (!search?.trim()) {
    return true;
  }

  const normalized = search.trim().toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalized));
}

export const reportsApi = {
  async getReportsDashboard(filters?: ReportsFilters): Promise<ReportsDashboardData> {
    await delay(180);

    const rows = MOCK_REPORT_ROWS.filter((item) => {
      const okSearch = matchesSearch(
        [item.reportName, item.reportKind, item.owner, item.status],
        filters?.search
      );

      const okKind =
        !filters?.kind || filters.kind === 'all' || item.reportKind === filters.kind;

      return okSearch && okKind;
    }).map(mapReportRow);

    return {
      metrics: MOCK_REPORT_METRICS,
      rows
    };
  }
};