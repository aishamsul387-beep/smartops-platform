'use client';

import { useCallback, useEffect, useState } from 'react';
import { warehouseApi, type WarehouseSummaryFilters } from '../api';
import type { WarehouseSiteScope, WarehouseUtilizationSummary } from '../types';

const initialSummary: WarehouseUtilizationSummary = {
  siteScope: 'all',
  warehouseCode: null,
  totalLocations: 0,
  activeLocations: 0,
  inactiveLocations: 0,
  emptyLocations: 0,
  occupiedLocations: 0,
  blockedLocations: 0,
  fullLocations: 0,
  fullLocationPct: 0,
  palletCapacityTotal: 0,
  palletCapacityUsed: 0,
  palletUtilizationPct: 0,
  pcsCapacityTotal: 0,
  pcsCapacityUsed: 0,
  pcsUtilizationPct: 0,
  cartonCapacityTotal: 0,
  cartonCapacityUsed: 0,
  cartonUtilizationPct: 0,
  updatedAt: ''
};

export function useWarehouseSummary(externalFilters?: Partial<WarehouseSummaryFilters>) {
  const [summary, setSummary] = useState<WarehouseUtilizationSummary>(initialSummary);
  const [siteScope, setSiteScope] = useState<WarehouseSiteScope>(externalFilters?.siteScope ?? 'all');
  const [warehouseCode, setWarehouseCode] = useState(externalFilters?.warehouseCode ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const resolvedSiteScope = externalFilters?.siteScope ?? siteScope;
      const resolvedWarehouseCode =
        externalFilters?.warehouseCode !== undefined
          ? externalFilters.warehouseCode
          : warehouseCode.trim() || undefined;

      const data = await warehouseApi.getSummary({
        search: externalFilters?.search,
        locationCode: externalFilters?.locationCode,
        status: externalFilters?.status,
        type: externalFilters?.type,
        active: externalFilters?.active,
        siteScope: resolvedSiteScope,
        warehouseCode: resolvedWarehouseCode
      });

      setSummary(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load warehouse summary');
    } finally {
      setIsLoading(false);
    }
  }, [
    externalFilters?.search,
    externalFilters?.locationCode,
    externalFilters?.status,
    externalFilters?.type,
    externalFilters?.active,
    externalFilters?.siteScope,
    externalFilters?.warehouseCode,
    siteScope,
    warehouseCode
  ]);

  useEffect(() => {
    if (externalFilters?.siteScope !== undefined) {
      setSiteScope(externalFilters.siteScope);
    }
  }, [externalFilters?.siteScope]);

  useEffect(() => {
    if (externalFilters?.warehouseCode !== undefined) {
      setWarehouseCode(externalFilters.warehouseCode);
    }
  }, [externalFilters?.warehouseCode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    summary,
    siteScope,
    warehouseCode,
    isLoading,
    error,
    setSiteScope,
    setWarehouseCode,
    refresh
  };
}
