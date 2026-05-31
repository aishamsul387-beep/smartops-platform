'use client';

import { useState } from 'react';
import { warehouseApi } from '../api';
import type { CreateWarehouseLocationRequest, WarehouseLocationRecord } from '../types';

export function useCreateWarehouseLocation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createLocation(payload: CreateWarehouseLocationRequest): Promise<WarehouseLocationRecord> {
    try {
      setIsSubmitting(true);
      setError(null);
      return await warehouseApi.createLocation(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to create warehouse location');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    createLocation,
    isSubmitting,
    error
  };
}