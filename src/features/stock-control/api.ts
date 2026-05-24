import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  DraftPurchaseOrderResult,
  ProcurementQueueItem,
  ReorderSuggestion,
  StockControlAlert,
  StockControlSummary
} from './types';

export const stockControlApi = {
  async getSummary(): Promise<StockControlSummary> {
    const response = await apiClient.get<StockControlSummary>(ENDPOINTS.stockControl.summary);
    return response.data;
  },

  async getAlerts(): Promise<StockControlAlert[]> {
    const response = await apiClient.get<StockControlAlert[]>(ENDPOINTS.stockControl.alerts);
    return response.data || [];
  },

  async getReorderSuggestions(): Promise<ReorderSuggestion[]> {
    const response = await apiClient.get<ReorderSuggestion[]>(
      ENDPOINTS.stockControl.reorderSuggestions
    );

    return response.data || [];
  },

  async getProcurementActions(): Promise<ProcurementQueueItem[]> {
    const response = await apiClient.get<ProcurementQueueItem[]>(
      ENDPOINTS.stockControl.procurementActions
    );

    return response.data || [];
  },

  async createDraftPurchaseOrderFromSuggestion(
    inventoryItemId: string
  ): Promise<DraftPurchaseOrderResult> {
    const response = await apiClient.post<DraftPurchaseOrderResult>(
      ENDPOINTS.stockControl.createDraftPurchaseOrderFromSuggestion(inventoryItemId),
      {}
    );

    return response.data;
  }
};