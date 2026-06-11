'use client';

import { useCallback, useEffect, useState } from 'react';
import { inventoryApi } from '../api';
import type {
  InventoryLocationBalanceListResponse,
  InventoryLocationBalanceRecord,
  InventoryLocationBalanceSummary
} from '../types';

export function useInventoryLocationBalances(inventoryItemId?: string) {
  const [items, setItems] = useState<InventoryLocationBalanceRecord[]>([]);
  const [summary, setSummary] = useState<InventoryLocationBalanceSummary>({
    totalLines: 0,
    totalOnHandQty: 0,
    totalAvailableQty: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryResult, balancesResult] = await Promise.all([
        inventoryApi.getLocationBalanceSummary(),
        inventoryItemId
          ? inventoryApi.getLocationBalancesByInventoryItem(inventoryItemId)
          : Promise.resolve<InventoryLocationBalanceListResponse>({ items: [], total: 0 })
      ]);

      setSummary(summaryResult);
      setItems(balancesResult.items);
    } catch (err: any) {
      setItems([]);
      setSummary({
        totalLines: 0,
        totalOnHandQty: 0,
        totalAvailableQty: 0
      });
      setError(err?.message || 'Failed to load inventory location balances');
    } finally {
      setIsLoading(false);
    }
  }, [inventoryItemId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function getBalanceByLocation(warehouseLocation: string) {
    const normalized = String(warehouseLocation ?? '').trim().toLowerCase();
    return (
      items.find(
        (item) => item.warehouseLocation.trim().toLowerCase() === normalized
      ) ?? null
    );
  }

  return {
    items,
    summary,
    isLoading,
    error,
    refresh,
    getBalanceByLocation
  };
}
