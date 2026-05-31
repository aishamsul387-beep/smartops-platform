import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { BatchRecord } from './types';

export const batchesApi = {
  async getBatchList(filters: any) {
    const query = new URLSearchParams();

    if (filters?.inventoryItemId) query.set('inventoryItemId', filters.inventoryItemId);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.search) query.set('search', filters.search);

    const queryString = query.toString();
    const url = queryString ? `${ENDPOINTS.batches.list}?${queryString}` : ENDPOINTS.batches.list;

    const response = await apiClient.get<any>(url);
    return response.data;
  },

  async getBatches(filters: any) {
    return this.getBatchList(filters);
  },

  async getBatchById(id: string): Promise<BatchRecord> {
    const response = await apiClient.get<any>(ENDPOINTS.batches.detail(id));
    return response.data;
  },

  async createBatch(payload: any) {
    const response = await apiClient.post<any>(ENDPOINTS.batches.create, payload);
    return response.data;
  },

  async updateBatchStatus(
    id: string,
    payload: { batchStatus: string; notes?: string }
  ): Promise<BatchRecord> {
    const response = await apiClient.patch<any>(`/batches/${id}/status`, payload);
    return response.data;
  }
};