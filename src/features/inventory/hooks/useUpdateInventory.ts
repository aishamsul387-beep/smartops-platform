'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryItem, UpdateInventoryRequest } from '../types';

export function useUpdateInventory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateInventory(payload: UpdateInventoryRequest): Promise<InventoryItem> {
    try {
      setIsSubmitting(true);
      setError(null);

      return await inventoryApi.updateInventory(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to update inventory item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    updateInventory,
    isSubmitting,
    error
  };
}