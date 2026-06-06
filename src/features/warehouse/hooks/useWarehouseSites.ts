'use client';

import { useCallback, useEffect, useState } from 'react';
import { warehouseApi } from '../api';
import type { WarehouseSiteRecord } from '../types';

export function useWarehouseSites() {
  const [items, setItems] = useState<WarehouseSiteRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await warehouseApi.getSites();
      setItems(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setItems([]);
      setTotal(0);
      setError(err?.message || 'Failed to load warehouse sites');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    items,
    total,
    isLoading,
    error,
    refresh
  };
}
