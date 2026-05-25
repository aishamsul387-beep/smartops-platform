import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { mapInventoryItem, mapInventoryListResponse } from './mapper';
import type {
  CreateInventoryRequest,
  InventoryDetailResponse,
  InventoryItemDto,
  InventoryListFilters,
  InventoryListResponse,
  UpdateInventoryRequest
} from './types';

function buildInventoryListUrl(filters: InventoryListFilters = {}) {
  const query = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters.status && filters.status !== 'all') {
    query.set('status', filters.status);
  }

  const queryString = query.toString();
  return queryString ? `${ENDPOINTS.inventory.list}?${queryString}` : ENDPOINTS.inventory.list;
}

export const inventoryApi = {
  async getInventoryList(filters: InventoryListFilters = {}): Promise<InventoryListResponse> {
    const response = await apiClient.get<any>(buildInventoryListUrl(filters));
    return mapInventoryListResponse(response.data);
  },

  async getInventoryById(id: string): Promise<InventoryDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.inventory.detail(id));
    return mapInventoryItem(response.data);
  },

  async getInventoryDetail(id: string): Promise<InventoryDetailResponse> {
    return this.getInventoryById(id);
  },

  async createInventory(payload: CreateInventoryRequest): Promise<InventoryItemDto> {
    const response = await apiClient.post<any>(ENDPOINTS.inventory.create, payload);
    return mapInventoryItem(response.data);
  },

  async updateInventory(
    id: string,
    payload: Omit<UpdateInventoryRequest, 'id'>
  ): Promise<InventoryItemDto> {
    const response = await apiClient.put<any>(ENDPOINTS.inventory.update(id), payload);
    return mapInventoryItem(response.data);
  },

  async toggleActive(id: string, isActive: boolean): Promise<InventoryItemDto> {
    const response = await apiClient.patch<any>(ENDPOINTS.inventory.toggleActive(id), {
      isActive
    });

    return mapInventoryItem(response.data);
  },

  async setInventoryActive(id: string, isActive: boolean): Promise<InventoryItemDto> {
    return this.toggleActive(id, isActive);
  }
};