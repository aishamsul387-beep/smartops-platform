'use client';

import { useState } from 'react';
import { ordersApi } from '../api';
import type { CreateGRNRequest, GRN } from '../types';

export function useCreateGRN() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createGRN(payload: CreateGRNRequest): Promise<GRN> {
    try {
      setIsSubmitting(true);
      setError(null);
      return await ordersApi.createGRN(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to create GRN');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    createGRN,
    isSubmitting,
    error
  };
}