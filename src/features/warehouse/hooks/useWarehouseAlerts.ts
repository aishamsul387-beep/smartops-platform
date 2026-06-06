'use client';

import { useCallback, useEffect, useState } from 'react';
import { warehouseApi, type WarehouseAlertFilters } from '../api';
import type { WarehouseLocationAlertSummary } from '../types';

const initialAlerts: WarehouseLocationAlertSummary = {
  siteScope: 'all',
  warehouseCode: null,
  thresholdPct: 80,
  totalAlertLocations: 0,
  nearFullLocations: 0,
  fullLocations: 0,
  items: [],
  updatedAt: ''
};

export function useWarehouseAlerts(filters?: Partial<WarehouseAlertFilters>) {
  const [alerts, setAlerts] = useState<WarehouseLocationAlertSummary>(initialAlerts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await warehouseApi.getAlerts({
        search: filters?.search,
        locationCode: filters?.locationCode,
        status: filters?.status,
        type: filters?.type,
        active: filters?.active,
        siteScope: filters?.siteScope,
        warehouseCode: filters?.warehouseCode,
        thresholdPct: filters?.thresholdPct
      });

      setAlerts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load warehouse alerts');
    } finally {
      setIsLoading(false);
    }
  }, [
    filters?.search,
    filters?.locationCode,
    filters?.status,
    filters?.type,
    filters?.active,
    filters?.siteScope,
    filters?.warehouseCode,
    filters?.thresholdPct
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    alerts,
    isLoading,
    error,
    refresh
  };
}
