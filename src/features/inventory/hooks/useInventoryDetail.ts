'use client';

import { useCallback, useEffect, useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryItem } from '../types';

export function useInventoryDetail(id: string) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryApi.getInventoryById(id);
      setItem(response.item);
    } catch (err: any) {
      setError(err?.message || 'Failed to load inventory item');
      setItem(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    item,
    isLoading,
    error,
    refresh: load
  };
}