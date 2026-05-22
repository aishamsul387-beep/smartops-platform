import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { mapWarehouseLocation } from './mapper';
import type { WarehouseLocationDto, WarehouseLocationFilters, WarehouseSummary } from './types';

export const warehouseApi = {
  async getWarehouseLocations(filters?: WarehouseLocationFilters) {
    const response = await apiClient.get<WarehouseLocationDto[]>(ENDPOINTS.warehouse.locations, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    return (response.data || []).map(mapWarehouseLocation);
  },

  async getWarehouseSummary(): Promise<WarehouseSummary> {
    const response = await apiClient.get<WarehouseSummary>(ENDPOINTS.warehouse.summary);
    return response.data;
  }
};