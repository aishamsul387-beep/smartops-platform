'use client';

import { useCallback, useEffect, useState } from 'react';
import { warehouseApi, type WarehouseSummaryFilters } from '../api';
import type { WarehouseUtilizationDrilldown } from '../types';

const initialDrilldown: WarehouseUtilizationDrilldown = {
  siteScope: 'all',
  warehouseCode: null,
  byLocationType: [],
  byZone: [],
  updatedAt: ''
};

export function useWarehouseDrilldown(filters?: Partial<WarehouseSummaryFilters>) {
  const [drilldown, setDrilldown] = useState<WarehouseUtilizationDrilldown>(initialDrilldown);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await warehouseApi.getDrilldown({
        search: filters?.search,
        locationCode: filters?.locationCode,
        status: filters?.status,
        type: filters?.type,
        active: filters?.active,
        siteScope: filters?.siteScope,
        warehouseCode: filters?.warehouseCode
      });

      setDrilldown(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load warehouse drilldown');
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
    filters?.warehouseCode
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    drilldown,
    isLoading,
    error,
    refresh
  };
}
