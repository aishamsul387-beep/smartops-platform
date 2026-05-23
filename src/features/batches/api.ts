import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
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