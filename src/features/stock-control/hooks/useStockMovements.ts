'use client';

import { useEffect, useState } from 'react';
import { stockControlApi } from '../api';
import type { StockMovementRecord } from '../types';

export function useStockMovements() {
  const [items, setItems] = useState<StockMovementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const rows = await stockControlApi.getStockMovements();
      setItems(rows);
    } catch (err: any) {
      setItems([]);
      setError(err?.message || 'Failed to load stock movements');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return {
    items,
    isLoading,
    error,
    refresh: load
  };
}