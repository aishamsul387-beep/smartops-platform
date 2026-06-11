'use client';

import { useState } from 'react';
import { inventoryApi } from '../api';
import type { CreateInventoryTransferDraftRequest } from '../types';

export function useInventoryTransferCommit() {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function commitTransfer(payload: CreateInventoryTransferDraftRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryApi.commitTransfer(payload);
      setResult(response);

      return response;
    } catch (err: any) {
      setResult(null);
      setError(err?.message || 'Failed to commit inventory transfer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function clearResult() {
    setResult(null);
    setError(null);
  }

  return {
    result,
    isLoading,
    error,
    commitTransfer,
    clearResult
  };
}
