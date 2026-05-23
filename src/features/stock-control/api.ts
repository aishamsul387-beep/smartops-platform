import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { StockControlAlert, StockControlSummary } from './types';

export const stockControlApi = {
  async getSummary(): Promise<StockControlSummary> {
    const response = await apiClient.get<StockControlSummary>(ENDPOINTS.stockControl.summary);
    return response.data;
  },

  async getAlerts(): Promise<StockControlAlert[]> {
    const response = await apiClient.get<StockControlAlert[]>(ENDPOINTS.stockControl.alerts);
    return response.data || [];
  }
};