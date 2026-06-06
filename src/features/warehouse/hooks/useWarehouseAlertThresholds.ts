'use client';

import { useCallback, useEffect, useState } from 'react';
import { warehouseApi } from '../api';
import type { WarehouseAlertThresholdRecord } from '../types';

export function useWarehouseAlertThresholds() {
  const [items, setItems] = useState<WarehouseAlertThresholdRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await warehouseApi.getAlertThresholds();
      setItems(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setItems([]);
      setTotal(0);
      setError(err?.message || 'Failed to load warehouse alert thresholds');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateThreshold(siteCode: string, thresholdPct: number) {
    try {
      setIsSaving(true);
      setError(null);

      await warehouseApi.updateAlertThreshold(siteCode, thresholdPct);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to update warehouse alert threshold');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function clearThreshold(siteCode: string) {
    try {
      setIsSaving(true);
      setError(null);

      await warehouseApi.clearAlertThreshold(siteCode);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to clear warehouse alert threshold');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    items,
    total,
    isLoading,
    isSaving,
    error,
    refresh,
    updateThreshold,
    clearThreshold
  };
}
