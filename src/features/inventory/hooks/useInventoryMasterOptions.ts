'use client';

import { useEffect, useState } from 'react';
import { uomApi } from '@/features/uom/api';
import type { UomConversionGroup, UomRecord } from '@/features/uom/types';

export function useInventoryMasterOptions() {
  const [uoms, setUoms] = useState<UomRecord[]>([]);
  const [conversionGroups, setConversionGroups] = useState<UomConversionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      setIsLoading(true);

      const [uomRows, groups] = await Promise.all([
        uomApi.getUoms({ search: '', type: 'all' }),
        uomApi.getConversionGroups('')
      ]);

      setUoms(uomRows.filter((item) => item.isActive));
      setConversionGroups(groups.filter((item) => item.isActive));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return {
    uoms,
    conversionGroups,
    isLoading,
    refresh: load
  };
}