import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  CreateInventoryRequest,
  InventoryDetailResponse,
  InventoryItemDto,
  InventoryListFilters,
  InventoryListResponse
} from './types';
import { mapInventoryItem } from './mapper';

export const inventoryApi = {
  async getInventoryList(filters?: InventoryListFilters): Promise<InventoryListResponse> {
    const response = await apiClient.get<InventoryItemDto[]>(ENDPOINTS.inventory.list, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    const items = (response.data || []).map(mapInventoryItem);

    return {
      items,
      total: items.length
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
  }
};
