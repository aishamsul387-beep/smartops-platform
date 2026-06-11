'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type { InventoryTransferSourceSuggestion } from '../types';

export function useInventoryTransferSuggestion() {
  const [suggestion, setSuggestion] = useState<InventoryTransferSourceSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function suggestSource(payload: {
    inventoryItemId: string;
    quantity: number;
  }) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await inventoryApi.suggestTransferSource(payload);
      setSuggestion(result);

      return result;
    } catch (err: any) {
      setSuggestion(null);
      setError(err?.message || 'Failed to suggest transfer source');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function clearSuggestion() {
    setSuggestion(null);
    setError(null);
  }

  return {
    suggestion,
    isLoading,
    error,
    suggestSource,
    clearSuggestion
  };
}
