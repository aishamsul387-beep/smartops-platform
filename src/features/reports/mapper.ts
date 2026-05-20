import type { ReportKind, ReportRow, ReportRowDto } from './types';

const KIND_LABELS: Record<ReportKind, string> = {
  'inventory-summary': 'Inventory Summary',
  'stock-alerts': 'Stock Alerts',
  'warehouse-utilization': 'Warehouse Utilization',
  'procurement-overview': 'Procurement Overview'
};

const STATUS_LABELS = {
  ready: 'Ready',
  processing: 'Processing'
} as const;

export function mapReportRow(dto: ReportRowDto): ReportRow {
  return {
    id: dto.id,
    reportName: dto.reportName,
    reportKind: dto.reportKind,
    reportKindLabel: KIND_LABELS[dto.reportKind],
    generatedAt: dto.generatedAt,
    owner: dto.owner,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status]
  };
}