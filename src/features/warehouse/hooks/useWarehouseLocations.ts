'use client';

import { useEffect, useMemo, useState } from 'react';
import { warehouseApi } from '../api';
import type { WarehouseLocation, WarehouseLocationFilters } from '../types';

const initialFilters: WarehouseLocationFilters = {
  search: '',
  status: 'all'
};

export function useWarehouseLocations() {
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [filters, setFilters] = useState<WarehouseLocationFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters: WarehouseLocationFilters) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await warehouseApi.getWarehouseLocations(nextFilters);
      setLocations(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load warehouse locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load(filters);
  }, [filters]);

  const totalVisible = useMemo(() => locations.length, [locations]);

  function updateSearch(value: string) {
    setFilters((current) => ({
      ...current,
      search: value
    }));
  }

  function updateStatus(value: WarehouseLocationFilters['status']) {
    setFilters((current) => ({
      ...current,
      status: value
    }));
  }

  async function refresh() {
    await load(filters);
  }

  return {
    locations,
    filters,
    isLoading,
    error,
    totalVisible,
    updateSearch,
    updateStatus,
    refresh
  };
}