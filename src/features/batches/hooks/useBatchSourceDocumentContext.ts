'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersApi } from '@/features/orders/api';
import type { GRNDetailResponse, PurchaseOrderDetailResponse } from '@/features/orders/types';

export interface BatchSourceDocumentContextResult {
  purchaseOrder: PurchaseOrderDetailResponse | null;
  grn: GRNDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasSourceContext: boolean;
}

function safeText(value: unknown) {
  return String(value ?? '').trim();
}

export function useBatchSourceDocumentContext(
  purchaseOrderNo?: string | null,
  goodsReceivedNoteNo?: string | null
): BatchSourceDocumentContextResult {
  const normalizedPoNo = safeText(purchaseOrderNo);
  const normalizedGrnNo = safeText(goodsReceivedNoteNo);

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderDetailResponse | null>(null);
  const [grn, setGrn] = useState<GRNDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!normalizedPoNo && !normalizedGrnNo) {
      setPurchaseOrder(null);
      setGrn(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [purchaseOrderResult, grnResult] = await Promise.all([
        normalizedPoNo ? ordersApi.findPurchaseOrderByNumber(normalizedPoNo) : Promise.resolve(null),
        normalizedGrnNo ? ordersApi.findGRNByNumber(normalizedGrnNo) : Promise.resolve(null)
      ]);

      setPurchaseOrder(purchaseOrderResult);
      setGrn(grnResult);
    } catch (err: any) {
      setPurchaseOrder(null);
      setGrn(null);
      setError(err?.message || 'Failed to load batch source document context');
    } finally {
      setIsLoading(false);
    }
  }, [normalizedPoNo, normalizedGrnNo]);

  useEffect(() => {
    void load();
  }, [load]);

  const hasSourceContext = useMemo(() => {
    return Boolean(normalizedPoNo || normalizedGrnNo || purchaseOrder || grn);
  }, [normalizedPoNo, normalizedGrnNo, purchaseOrder, grn]);

  return {
    purchaseOrder,
    grn,
    isLoading,
    error,
    refresh: load,
    hasSourceContext
  };
}
