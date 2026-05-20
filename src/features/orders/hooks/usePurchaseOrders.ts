'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '../api';
import type { OrdersListFilters, PurchaseOrder } from '../types';

const initialFilters: OrdersListFilters = {
  search: '',
  status: 'all'
};

export function usePurchaseOrders() {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [filters, setFilters] = useState<OrdersListFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters: OrdersListFilters) {
    try {
      setIsLoading(true);
      setError(null);
      setItems(await ordersApi.getPurchaseOrders(nextFilters));
    } catch (err: any) {
      setError(err?.message || 'Failed to load purchase orders');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  return {
    items,
    filters,
    isLoading,
    error,
    updateSearch: (value: string) =>
      setFilters((current) => ({
        ...current,
        search: value
      })),
    updateStatus: (value: string) =>
      setFilters((current) => ({
        ...current,
        status: value
      })),
    refresh: () => load(filters)
  };
}