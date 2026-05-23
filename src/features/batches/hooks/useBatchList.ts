'use client';

import { useEffect, useState } from 'react';
import { batchesApi } from '../api';
import type { BatchListFilters, BatchRecord } from '../types';

export function useBatchList(initialFilters?: BatchListFilters) {
  const [items, setItems] = useState<BatchRecord[]>([]);
  const [filters, setFilters] = useState<BatchListFilters>({
    inventoryItemId: initialFilters?.inventoryItemId || '',
    status: initialFilters?.status || 'all',
    search: initialFilters?.search || ''
  });
  const [total, setTotal] = useState(0);
  const [persistenceMode, setPersistenceMode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters: BatchListFilters) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await batchesApi.getBatches(nextFilters);

      setItems(response.items);
      setTotal(response.total);
      setPersistenceMode(response.persistenceMode);
    } catch (err: any) {
      setError(err?.message || 'Failed to load batches');
      setItems([]);
      setTotal(0);
      setPersistenceMode(undefined);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  return {
    items,
    total,
    filters,
    persistenceMode,
    isLoading,
    error,
    updateSearch: (value: string) =>
      setFilters((current) => ({
        ...current,
        search: value
      })),
    updateStatus: (value: BatchListFilters['status']) =>
      setFilters((current) => ({
        ...current,
        status: value
      })),
    updateInventoryItemId: (value: string) =>
      setFilters((current) => ({
        ...current,
        inventoryItemId: value
      })),
    refresh: () => load(filters)
  };
}