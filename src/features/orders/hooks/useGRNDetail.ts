'use client';

import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api';
import type { GRN } from '../types';

export function useGRNDetail(id: string) {
  const [item, setItem] = useState<GRN | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.getGRNById(id);
      setItem(response.item);
    } catch (err: any) {
      setError(err?.message || 'Failed to load goods received note');
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