'use client';

import { useCallback, useEffect, useState } from 'react';
import { inventoryApi } from '../api';
import type {
  InventoryTransferListFilters,
  InventoryTransferListResponse,
  InventoryTransferRecord
} from '../types';

export function useInventoryTransfers(initialFilters?: InventoryTransferListFilters) {
  const [items, setItems] = useState<InventoryTransferRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<InventoryTransferListFilters>({
    inventoryItemId: initialFilters?.inventoryItemId ?? '',
    search: initialFilters?.search ?? '',
    warehouseLocation: initialFilters?.warehouseLocation ?? ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransfers = useCallback(async (nextFilters?: InventoryTransferListFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const effective = nextFilters ?? filters;
      const response: InventoryTransferListResponse = await inventoryApi.getTransfers(effective);

      setItems(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setItems([]);
      setTotal(0);
      setError(err?.message || 'Failed to load inventory transfers');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadTransfers();
  }, [loadTransfers]);

  function updateSearch(search: string) {
    setFilters((current) => ({
      ...current,
      search
    }));
  }

  function updateWarehouseLocation(warehouseLocation: string) {
    setFilters((current) => ({
      ...current,
      warehouseLocation
    }));
  }

  function updateInventoryItemId(inventoryItemId: string) {
    setFilters((current) => ({
      ...current,
      inventoryItemId
    }));
  }

  async function refresh() {
    await loadTransfers(filters);
  }

  return {
    items,
    total,
    filters,
    isLoading,
    error,
    updateSearch,
    updateWarehouseLocation,
    updateInventoryItemId,
    refresh
  };
}
