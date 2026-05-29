import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { getAccessToken } from '@/services/auth/token-storage';
import type {
  BatchListFilters,
  BatchListResponse,
  BatchRecord,
  CreateBatchRequest
} from './types';

interface BatchListApiPayload {
  items: BatchRecord[];
  total: number;
  persistenceMode?: string;
}

export const batchesApi = {
  async getBatches(filters?: BatchListFilters): Promise<BatchListResponse> {
    const response = await apiClient.get<BatchListApiPayload>(ENDPOINTS.batches.list, {
      query: {
        inventoryItemId: filters?.inventoryItemId || '',
        status: filters?.status || 'all',
        search: filters?.search || ''
      }
    });

    const payload = response.data;

    return {
      items: payload?.items || [],
      total: Number(payload?.total ?? 0),
      persistenceMode: payload?.persistenceMode
    };
  },

  async getBatchById(id: string): Promise<BatchRecord | null> {
    const response = await apiClient.get<BatchRecord>(ENDPOINTS.batches.detail(id));
    return response.data || null;
  },

  async createBatch(payload: CreateBatchRequest): Promise<BatchRecord> {
    const response = await apiClient.post<BatchRecord>(ENDPOINTS.batches.create, payload);
    return response.data;
  }
};

export type H10ABatchStatus = 'available' | 'blocked' | 'quarantine' | 'expired' | 'consumed';

export interface H10ABatchDetail {
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
  batchStatus: H10ABatchStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface H10AStockMovementRecord {
  id: string;
  movementType: 'receipt';
  inventoryItemId: string;
  itemCode: string;
  barcode: string;
  itemName: string;
  batchId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  supplierName: string;
  qtyIn: number;
  qtyOut: number;
  netQty: number;
  availableQty: number;
  reservedQty: number;
  blockedQty: number;
  qaHoldQty: number;
  unitCost: number;
  currency: string;
  batchStatus: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  referenceType: 'grn' | 'po' | 'batch';
  referenceNo: string;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  occurredAt: string;
  notes: string;
}

export interface H10AUpdateBatchStatusInput {
  batchStatus: H10ABatchStatus;
  statusNote?: string;
}

function h10aResolveBatchApiBaseUrl() {
  const envCandidates = [
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_API_URL,
    process.env.NEXT_PUBLIC_BASE_API_URL
  ];

  const envValue = envCandidates.find((value) => String(value ?? '').trim());
  if (envValue) {
    return String(envValue).replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000/api';
    }

    return 'https://smartops-platform-backend.onrender.com/api';
  }

  return 'http://localhost:4000/api';
}

async function h10aPatchRequest<T>(path: string, payload: unknown): Promise<T> {
  const token = getAccessToken() ?? '';
  const headers = new Headers();

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${h10aResolveBatchApiBaseUrl()}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
    credentials: 'include',
    cache: 'no-store'
  });

  const rawText = await response.text();
  let parsed: any = null;

  if (rawText) {
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = rawText;
    }
  }

  if (!response.ok) {
    const message =
      parsed?.error?.message ||
      parsed?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return (parsed?.data ?? parsed) as T;
}

export async function h10aGetBatchDetail(batchId: string): Promise<H10ABatchDetail> {
  const response = await apiClient.get<H10ABatchDetail>(ENDPOINTS.batches.detail(batchId));
  return response.data;
}

export async function h10aUpdateBatchStatus(
  batchId: string,
  input: H10AUpdateBatchStatusInput
): Promise<H10ABatchDetail> {
  return h10aPatchRequest<H10ABatchDetail>(`/batches/${batchId}/status`, {
    batchStatus: input.batchStatus,
    statusNote: input.statusNote ?? ''
  });
}

export async function h10aGetBatchMovements(batchId: string): Promise<H10AStockMovementRecord[]> {
  const response = await apiClient.get<H10AStockMovementRecord[]>(
    `/stock-control/movements/batch/${batchId}`
  );

  return response.data || [];
}
