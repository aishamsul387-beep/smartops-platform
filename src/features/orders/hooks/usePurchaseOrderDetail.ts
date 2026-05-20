'use client';

import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api';
import type { PurchaseOrder } from '../types';

export function usePurchaseOrderDetail(id: string) {
  const [item, setItem] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.getPurchaseOrderById(id);
      setItem(response.item);
    } catch (err: any) {
      setError(err?.message || 'Failed to load purchase order');
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