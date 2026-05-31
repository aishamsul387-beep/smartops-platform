'use client';

import { useState } from 'react';
import { stockControlApi } from '@/features/stock-control/api';
import type { StockIssuePreviewResult, StockIssueResult } from '@/features/stock-control/types';

export function useStockIssue() {
  const [preview, setPreview] = useState<StockIssuePreviewResult | null>(null);
  const [result, setResult] = useState<StockIssueResult | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function previewIssue(inventoryItemId: string, requestedQty: number) {
    try {
      setIsPreviewLoading(true);
      setError(null);
      const data = await stockControlApi.getIssuePreview(inventoryItemId, requestedQty);
      setPreview(data);
      return data;
    } catch (err: any) {
      setPreview(null);
      setError(err?.message || 'Failed to preview issue allocation');
      throw err;
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function submitIssue(payload: {
    inventoryItemId: string;
    requestedQty: number;
    reason: string;
  }) {
    try {
      setIsSubmitting(true);
      setError(null);
      const data = await stockControlApi.createIssue(payload);
      setResult(data);
      return data;
    } catch (err: any) {
      setResult(null);
      setError(err?.message || 'Failed to create stock issue');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    preview,
    result,
    isPreviewLoading,
    isSubmitting,
    error,
    previewIssue,
    submitIssue
  };
}