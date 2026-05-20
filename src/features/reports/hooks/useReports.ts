'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '../api';
import type { ReportMetric, ReportRow, ReportsFilters } from '../types';

const initialFilters: ReportsFilters = {
  search: '',
  kind: 'all'
};

export function useReports() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [filters, setFilters] = useState<ReportsFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters: ReportsFilters) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reportsApi.getReportsDashboard(nextFilters);
      setMetrics(data.metrics);
      setRows(data.rows);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reports');
      setMetrics([]);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  return {
    metrics,
    rows,
    filters,
    isLoading,
    error,
    updateSearch: (value: string) =>
      setFilters((current) => ({
        ...current,
        search: value
      })),
    updateKind: (value: ReportsFilters['kind']) =>
      setFilters((current) => ({
        ...current,
        kind: value
      })),
    refresh: () => load(filters)
  };
}