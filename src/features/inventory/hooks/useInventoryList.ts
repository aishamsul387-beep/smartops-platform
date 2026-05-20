'use client';

import { useEffect, useMemo, useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryItem, InventoryListFilters } from '../types';

const initialFilters: InventoryListFilters = {
  search: '',
  status: 'all'
};

export function useInventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState<InventoryListFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInventory(nextFilters: InventoryListFilters) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryApi.getInventoryList(nextFilters);
      setItems(response.items);
    } catch (err: any) {
      setError(err?.message || 'Failed to load inventory');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadInventory(filters);
  }, [filters]);

  const totalItems = useMemo(() => items.length, [items]);
  const lowStockCount = useMemo(
    () => items.filter((item) => item.status === 'low_stock').length,
    [items]
  );
  const outOfStockCount = useMemo(
    () => items.filter((item) => item.status === 'out_of_stock').length,
    [items]
  );

  function updateSearch(value: string) {
    setFilters((current) => ({
      ...current,
      search: value
    }));
  }

  function updateStatus(value: InventoryListFilters['status']) {
    setFilters((current) => ({
      ...current,
      status: value
    }));
  }

  async function refresh() {
    await loadInventory(filters);
  }

  return {
    items,
    filters,
    isLoading,
    error,
    totalItems,
    lowStockCount,
    outOfStockCount,
    updateSearch,
    updateStatus,
    refresh
  };
}