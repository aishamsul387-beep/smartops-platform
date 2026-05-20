'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type { CreateInventoryRequest, InventoryItem } from '../types';

export function useCreateInventory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createInventory(payload: CreateInventoryRequest): Promise<InventoryItem> {
    try {
      setIsSubmitting(true);
      setError(null);

      return await inventoryApi.createInventory(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to create inventory item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    createInventory,
    isSubmitting,
    error
  };
}