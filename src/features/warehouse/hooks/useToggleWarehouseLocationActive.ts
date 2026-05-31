'use client';

import { useState } from 'react';
import { warehouseApi } from '../api';
import type { WarehouseLocationRecord } from '../types';

export function useToggleWarehouseLocationActive() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(id: string, isActive: boolean): Promise<WarehouseLocationRecord> {
    try {
      setIsSubmitting(true);
      setError(null);
      return await warehouseApi.toggleLocationActive(id, isActive);
    } catch (err: any) {
      setError(err?.message || 'Failed to update active status');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    toggleActive,
    isSubmitting,
    error
  };
}