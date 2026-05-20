'use client';

import { useEffect, useMemo, useState } from 'react';
import { tasksApi } from '../api';
import type { TaskListFilters, WarehouseTask } from '../types';

const initialFilters: TaskListFilters = {
  search: '',
  status: 'all',
  priority: 'all'
};

export function useTaskList() {
  const [items, setItems] = useState<WarehouseTask[]>([]);
  const [filters, setFilters] = useState<TaskListFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters: TaskListFilters) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksApi.getTaskList(nextFilters);
      setItems(response.items);
    } catch (err: any) {
      setError(err?.message || 'Failed to load tasks');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === 'pending').length,
    [items]
  );

  const blockedCount = useMemo(
    () => items.filter((item) => item.status === 'blocked').length,
    [items]
  );

  function updateSearch(value: string) {
    setFilters((current) => ({
      ...current,
      search: value
    }));
  }

  function updateStatus(value: TaskListFilters['status']) {
    setFilters((current) => ({
      ...current,
      status: value
    }));
  }

  function updatePriority(value: TaskListFilters['priority']) {
    setFilters((current) => ({
      ...current,
      priority: value
    }));
  }

  async function refresh() {
    await load(filters);
  }

  return {
    items,
    filters,
    isLoading,
    error,
    pendingCount,
    blockedCount,
    updateSearch,
    updateStatus,
    updatePriority,
    refresh
  };
}