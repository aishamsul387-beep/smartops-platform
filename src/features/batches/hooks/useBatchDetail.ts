'use client';

import { useEffect, useState } from 'react';
import { batchesApi } from '../api';

export interface BatchDetailRecord {
  id: string;
  inventoryItemId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  supplierName: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  unitCost: number;
  currency: string;
  receivedQty: number;
  availableQty: number;
  reservedQty: number;
  blockedQty: number;
  qaHoldQty: number;
  batchStatus: string;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  notes: string;
}

export function useBatchDetail(id: string) {
  const [item, setItem] = useState<BatchDetailRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await batchesApi.getBatchById(id);
      setItem(response);
    } catch (err: any) {
      setItem(null);
      setError(err?.message || 'Failed to load batch detail');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  return {
    item,
    isLoading,
    error,
    refresh: load,
    setItem
  };
}