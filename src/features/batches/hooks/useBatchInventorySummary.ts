'use client';

import { useEffect, useState } from 'react';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';

export function useBatchInventorySummary(inventoryItemId: string) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!inventoryItemId.trim()) {
      setItem(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryApi.getInventoryById(inventoryItemId);
      setItem(response);
    } catch (err: any) {
      setItem(null);
      setError(err?.message || 'Failed to load inventory summary');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [inventoryItemId]);

  return {
    item,
    isLoading,
    error,
    refresh: load
  };
}