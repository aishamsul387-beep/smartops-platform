'use client';

import { useEffect, useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryItem } from '../types';

export function useInventoryDetail(id: string) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryApi.getInventoryById(id);
      setItem(response);
    } catch (err: any) {
      setItem(null);
      setError(err?.message || 'Failed to load inventory item');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  return {
    item,
    isLoading,
    error,
    refresh: load
  };
}