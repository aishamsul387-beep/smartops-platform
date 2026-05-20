'use client';

import { useState } from 'react';
import { ordersApi } from '../api';
import type { CreatePurchaseOrderRequest, PurchaseOrder } from '../types';

export function useCreatePurchaseOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPurchaseOrder(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      setIsSubmitting(true);
      setError(null);
      return await ordersApi.createPurchaseOrder(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to create purchase order');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    createPurchaseOrder,
    isSubmitting,
    error
  };
}