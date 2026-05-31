'use client';

import { useEffect, useState } from 'react';
import { warehouseApi } from '../api';

export interface WarehouseSummary {
  totalLocations: number;
  activeLocations: number;
  emptyLocations: number;
  occupiedLocations: number;
  blockedLocations: number;

  // compatibility fields for older WarehouseScreen
  fullLocations: number;
  utilizationPercent: number;
  totalOccupied: number;
  totalCapacity: number;
}

export function useWarehouseSummary() {
  const [summary, setSummary] = useState<WarehouseSummary>({
    totalLocations: 0,
    activeLocations: 0,
    emptyLocations: 0,
    occupiedLocations: 0,
    blockedLocations: 0,
    fullLocations: 0,
    utilizationPercent: 0,
    totalOccupied: 0,
    totalCapacity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const result = await warehouseApi.getLocations({
        search: '',
        status: 'all',
        type: 'all',
        active: 'all'
      });

      const items = result.items || [];

      const totalLocations = result.total || items.length;
      const activeLocations = items.filter((item) => item.isActive).length;
      const emptyLocations = items.filter((item) => item.status === 'empty').length;
      const occupiedLocations = items.filter((item) => item.status === 'occupied').length;
      const blockedLocations = items.filter((item) => item.status === 'blocked').length;

      const totalOccupied = items.reduce(
        (sum, item) => sum + Number(item.usedPalletCapacity || 0),
        0
      );

      const totalCapacity = items.reduce(
        (sum, item) => sum + Number(item.palletCapacity || 0),
        0
      );

      const utilizationPercent =
        totalCapacity > 0
          ? Number(((totalOccupied / totalCapacity) * 100).toFixed(1))
          : 0;

      setSummary({
        totalLocations,
        activeLocations,
        emptyLocations,
        occupiedLocations,
        blockedLocations,
        fullLocations: occupiedLocations,
        utilizationPercent,
        totalOccupied,
        totalCapacity
      });
    } catch (err: any) {
      setSummary({
        totalLocations: 0,
        activeLocations: 0,
        emptyLocations: 0,
        occupiedLocations: 0,
        blockedLocations: 0,
        fullLocations: 0,
        utilizationPercent: 0,
        totalOccupied: 0,
        totalCapacity: 0
      });
      setError(err?.message || 'Failed to load warehouse summary');
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