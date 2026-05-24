'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '../api';
import type { GRN } from '../types';

export function useGRNDetail(id: string) {
  const [item, setItem] = useState<GRN | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ordersApi.getGRNDetail(id);
      setItem(response);
    } catch (err: any) {
      setItem(null);
      setError(err?.message || 'Failed to load goods received note');
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