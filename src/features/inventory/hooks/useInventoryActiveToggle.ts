'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryItem } from '../types';

export function useInventoryActiveToggle() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleInventory(item: InventoryItem): Promise<InventoryItem> {
    try {
      setIsSubmitting(true);
      setError(null);

      return await inventoryApi.setInventoryActive(item.id, !item.isActive);
    } catch (err: any) {
      setError(err?.message || 'Failed to update inventory active status');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    toggleInventory,
    isSubmitting,
    error
  };
}