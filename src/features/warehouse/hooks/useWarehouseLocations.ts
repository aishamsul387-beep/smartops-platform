'use client';

import { useEffect, useState } from 'react';
import { warehouseApi } from '../api';
import type {
  WarehouseLocationListFilters,
  WarehouseLocationRecord,
  WarehouseLocationStatus
} from '../types';

export function useWarehouseLocations() {
  const [items, setItems] = useState<WarehouseLocationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<WarehouseLocationListFilters>({
    search: '',
    locationCode: '',
    status: 'all',
    type: 'all',
    active: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextFilters?: WarehouseLocationListFilters) {
    try {
      setIsLoading(true);
      setError(null);

      const effective = nextFilters ?? filters;
      const response = await warehouseApi.getLocations(effective);

      setItems(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setItems([]);
      setTotal(0);
      setError(err?.message || 'Failed to load warehouse locations');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [filters.search, filters.locationCode, filters.status, filters.type, filters.active]);

  function updateSearch(search: string) {
    setFilters((current) => ({
      ...current,
      search
    }));
  }

  function updateLocationCode(locationCode: string) {
    setFilters((current) => ({
      ...current,
      locationCode
    }));
  }

  function updateStatus(status: 'all' | WarehouseLocationStatus) {
    setFilters((current) => ({
      ...current,
      status
    }));
  }

  function updateType(type: WarehouseLocationListFilters['type']) {
    setFilters((current) => ({
      ...current,
      type
    }));
  }

  function updateActive(active: WarehouseLocationListFilters['active']) {
    setFilters((current) => ({
      ...current,
      active
    }));
  }

  return {
    items,
    total,
    filters,
    isLoading,
    error,
    updateSearch,
    updateLocationCode,
    updateStatus,
    updateType,
    updateActive,
    refresh: () => load(filters)
  };
}
