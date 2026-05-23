import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  CreateInventoryRequest,
  InventoryDetailResponse,
  InventoryItemDto,
  InventoryListFilters,
  InventoryListResponse,
  UpdateInventoryRequest
} from './types';
import { mapInventoryItem } from './mapper';

interface InventoryListApiPayload {
  items: InventoryItemDto[];
  total: number;
  persistenceMode?: string;
}

export const inventoryApi = {
  async getInventoryList(filters?: InventoryListFilters): Promise<InventoryListResponse> {
    const response = await apiClient.get<InventoryListApiPayload>(ENDPOINTS.inventory.list, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    const payload = response.data;
    const items = (payload?.items || []).map(mapInventoryItem);

    return {
      items,
      total: Number(payload?.total ?? items.length)
    };
  },

  async getInventoryById(id: string): Promise<InventoryDetailResponse> {
    const response = await apiClient.get<InventoryItemDto>(ENDPOINTS.inventory.detail(id));

    return {
      item: response.data ? mapInventoryItem(response.data) : null
    };
  },

  async createInventory(payload: CreateInventoryRequest) {
    const response = await apiClient.post<InventoryItemDto>(
      ENDPOINTS.inventory.create,
      payload
    );

    return mapInventoryItem(response.data);
  },

  async updateInventory(payload: UpdateInventoryRequest) {
    const response = await apiClient.put<InventoryItemDto>(
      ENDPOINTS.inventory.update(payload.id),
      payload
    );

    return mapInventoryItem(response.data);
  },

  async setInventoryActive(id: string, isActive: boolean) {
    const response = await apiClient.patch<InventoryItemDto>(
      ENDPOINTS.inventory.toggleActive(id),
      { isActive }
    );

    return mapInventoryItem(response.data);
  }
};