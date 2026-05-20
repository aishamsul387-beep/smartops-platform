'use client';

import { useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api';
import type { WarehouseTask } from '../types';

export function useTaskDetail(id: string) {
  const [item, setItem] = useState<WarehouseTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await tasksApi.getTaskById(id);
      setItem(response.item);
    } catch (err: any) {
      setError(err?.message || 'Failed to load task detail');
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