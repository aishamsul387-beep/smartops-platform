import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  DraftPurchaseOrderResult,
  ProcurementQueueItem,
  ReorderSuggestion,
  StockControlAlert,
  StockControlSummary,
  StockIssuePreviewResult,
  StockIssueResult,
  StockMovementRecord
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
  },

  async getStockMovements(): Promise<StockMovementRecord[]> {
    const response = await apiClient.get<StockMovementRecord[]>(ENDPOINTS.stockControl.movements);
    return response.data || [];
  },

  async getInventoryStockMovements(inventoryItemId: string): Promise<StockMovementRecord[]> {
    const response = await apiClient.get<StockMovementRecord[]>(
      ENDPOINTS.stockControl.movementsByInventory(inventoryItemId)
    );
    return response.data || [];
  },

  async getBatchStockMovements(batchId: string): Promise<StockMovementRecord[]> {
    const response = await apiClient.get<StockMovementRecord[]>(
      ENDPOINTS.stockControl.movementsByBatch(batchId)
    );
    return response.data || [];
  },

  async getIssuePreview(
    inventoryItemId: string,
    requestedQty: number
  ): Promise<StockIssuePreviewResult> {
    const query = new URLSearchParams({
      inventoryItemId,
      requestedQty: String(requestedQty)
    }).toString();

    const response = await apiClient.get<StockIssuePreviewResult>(
      `${ENDPOINTS.stockControl.issuePreview}?${query}`
    );
    return response.data;
  },

  async createIssue(payload: {
    inventoryItemId: string;
    requestedQty: number;
    reason: string;
  }): Promise<StockIssueResult> {
    const response = await apiClient.post<StockIssueResult>(
      ENDPOINTS.stockControl.createIssue,
      payload
    );
    return response.data;
  }
};