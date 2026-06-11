'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type {
  CreateInventoryTransferDraftRequest,
  InventoryTransferDraft
} from '../types';

export function useInventoryTransferDraft() {
  const [draft, setDraft] = useState<InventoryTransferDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function previewTransfer(payload: CreateInventoryTransferDraftRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await inventoryApi.createTransferDraft(payload);
      setDraft(result);

      return result;
    } catch (err: any) {
      setDraft(null);
      setError(err?.message || 'Failed to preview inventory transfer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function clearDraft() {
    setDraft(null);
    setError(null);
  }

  return {
    draft,
    isLoading,
    error,
    previewTransfer,
    clearDraft
  };
}
