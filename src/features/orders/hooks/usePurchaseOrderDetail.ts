'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '../api';
import type { PurchaseOrder } from '../types';

export function usePurchaseOrderDetail(id: string) {
  const [item, setItem] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ordersApi.getPurchaseOrderDetail(id);
      setItem(response);
    } catch (err: any) {
      setItem(null);
      setError(err?.message || 'Failed to load purchase order');
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