'use client';

import { useEffect, useState } from 'react';
import { warehouseApi } from '../api';
import type { WarehouseSummary } from '../types';

const initialSummary: WarehouseSummary = {
  totalLocations: 0,
  activeLocations: 0,
  fullLocations: 0,
  totalCapacity: 0,
  totalOccupied: 0,
  utilizationPercent: 0
};

export function useWarehouseSummary() {
  const [summary, setSummary] = useState<WarehouseSummary>(initialSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await warehouseApi.getWarehouseSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load warehouse summary');
      setSummary(initialSummary);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return {
    summary,
    isLoading,
    error,
    refresh: load
  };
}