'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';

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

function asText(value: unknown, fallback = '') {
  return String(value ?? fallback);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function mapBatch(payload: any): BatchDetailRecord {
  return {
    id: asText(payload?.id),
    inventoryItemId: asText(payload?.inventoryItemId),
    batchNumber: asText(payload?.batchNumber),
    lotNumber: asText(payload?.lotNumber),
    supplierLotNumber: asText(payload?.supplierLotNumber),
    manufactureDate: payload?.manufactureDate ? asText(payload?.manufactureDate) : null,
    expiryDate: payload?.expiryDate ? asText(payload?.expiryDate) : null,
    receivedDate: payload?.receivedDate ? asText(payload?.receivedDate) : null,
    supplierName: asText(payload?.supplierName),
    purchaseOrderNo: asText(payload?.purchaseOrderNo),
    goodsReceivedNoteNo: asText(payload?.goodsReceivedNoteNo),
    unitCost: asNumber(payload?.unitCost, 0),
    currency: asText(payload?.currency, 'USD'),
    receivedQty: asNumber(payload?.receivedQty, 0),
    availableQty: asNumber(payload?.availableQty, 0),
    reservedQty: asNumber(payload?.reservedQty, 0),
    blockedQty: asNumber(payload?.blockedQty, 0),
    qaHoldQty: asNumber(payload?.qaHoldQty, 0),
    batchStatus: asText(payload?.batchStatus),
    warehouseLocation: asText(payload?.warehouseLocation),
    zone: asText(payload?.zone),
    aisle: asText(payload?.aisle),
    levelCode: asText(payload?.levelCode),
    bin: asText(payload?.bin),
    notes: asText(payload?.notes)
  };
}

export function useBatchDetail(id: string) {
  const [item, setItem] = useState<BatchDetailRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<any>(ENDPOINTS.batches.detail(id));
      setItem(mapBatch(response.data));
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
    refresh: load
  };
}