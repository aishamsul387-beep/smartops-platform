import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import {
  mapInventoryItem,
  mapInventoryListResponse,
  mapInventoryDetailResponse
} from './mapper';
import type {
  CreateInventoryRequest,
  CreateInventoryTransferDraftRequest,
  InventoryDetailResponse,
  InventoryItemDto,
  InventoryListFilters,
  InventoryListResponse,
  InventoryLocationBalanceListResponse,
  InventoryLocationBalanceRecord,
  InventoryLocationBalanceSummary,
  InventoryTransferDraft,
  InventoryTransferListFilters,
  InventoryTransferListResponse,
  InventoryTransferRecord,
  InventoryTransferSourceSuggestion,
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

function buildInventoryLocationBalancesUrl(filters?: {
  inventoryItemId?: string;
  search?: string;
  warehouseLocation?: string;
}) {
  const query = new URLSearchParams();

  if (filters?.inventoryItemId && filters.inventoryItemId.trim()) {
    query.set('inventoryItemId', filters.inventoryItemId.trim());
  }

  if (filters?.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters?.warehouseLocation && filters.warehouseLocation.trim()) {
    query.set('warehouseLocation', filters.warehouseLocation.trim());
  }

  const queryString = query.toString();
  return queryString ? '/inventory/location-balances?' + queryString : '/inventory/location-balances';
}

function buildInventoryTransfersUrl(filters?: InventoryTransferListFilters) {
  const query = new URLSearchParams();

  if (filters?.inventoryItemId && filters.inventoryItemId.trim()) {
    query.set('inventoryItemId', filters.inventoryItemId.trim());
  }

  if (filters?.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters?.warehouseLocation && filters.warehouseLocation.trim()) {
    query.set('warehouseLocation', filters.warehouseLocation.trim());
  }

  const queryString = query.toString();
  return queryString ? '/inventory/transfers?' + queryString : '/inventory/transfers';
}

function mapInventoryLocationBalanceListResponse(data: any): InventoryLocationBalanceListResponse {
  const payload = data?.data ?? data ?? {};
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  const items: InventoryLocationBalanceRecord[] = rawItems.map((item: any) => ({
    id: String(item?.id ?? '').trim(),
    inventoryItemId: String(item?.inventoryItemId ?? '').trim(),
    sku: String(item?.sku ?? '').trim(),
    itemName: String(item?.itemName ?? '').trim(),
    warehouseLocation: String(item?.warehouseLocation ?? '').trim(),
    onHandQty: Number(item?.onHandQty ?? 0),
    reservedQty: Number(item?.reservedQty ?? 0),
    availableQty: Number(item?.availableQty ?? 0),
    unit: String(item?.unit ?? '').trim(),
    updatedAt: String(item?.updatedAt ?? '').trim()
  }));

  const total = Number.isFinite(Number(payload.total)) ? Number(payload.total) : items.length;

  return { items, total };
}

function mapInventoryLocationBalanceSummary(data: any): InventoryLocationBalanceSummary {
  const payload = data?.data ?? data ?? {};

  return {
    totalLines: Number(payload?.totalLines ?? 0),
    totalOnHandQty: Number(payload?.totalOnHandQty ?? 0),
    totalAvailableQty: Number(payload?.totalAvailableQty ?? 0)
  };
}

function mapInventoryTransferDraft(data: any): InventoryTransferDraft {
  const payload = data?.data ?? data ?? {};

  return {
    inventoryItemId: String(payload?.inventoryItemId ?? '').trim(),
    sku: String(payload?.sku ?? '').trim(),
    itemName: String(payload?.itemName ?? '').trim(),
    unit: String(payload?.unit ?? '').trim(),
    quantity: Number(payload?.quantity ?? 0),
    fromWarehouseLocation: String(payload?.fromWarehouseLocation ?? '').trim(),
    toWarehouseLocation: String(payload?.toWarehouseLocation ?? '').trim(),
    reason: String(payload?.reason ?? '').trim(),
    notes: String(payload?.notes ?? '').trim(),
    availableSourceBalance: payload?.availableSourceBalance
      ? {
          id: String(payload.availableSourceBalance.id ?? '').trim(),
          inventoryItemId: String(payload.availableSourceBalance.inventoryItemId ?? '').trim(),
          sku: String(payload.availableSourceBalance.sku ?? '').trim(),
          itemName: String(payload.availableSourceBalance.itemName ?? '').trim(),
          warehouseLocation: String(payload.availableSourceBalance.warehouseLocation ?? '').trim(),
          onHandQty: Number(payload.availableSourceBalance.onHandQty ?? 0),
          reservedQty: Number(payload.availableSourceBalance.reservedQty ?? 0),
          availableQty: Number(payload.availableSourceBalance.availableQty ?? 0),
          unit: String(payload.availableSourceBalance.unit ?? '').trim(),
          updatedAt: String(payload.availableSourceBalance.updatedAt ?? '').trim()
        }
      : null
  };
}

function mapInventoryTransferRecord(data: any): InventoryTransferRecord {
  const payload = data?.data ?? data ?? {};

  return {
    id: String(payload?.id ?? '').trim(),
    inventoryItemId: String(payload?.inventoryItemId ?? '').trim(),
    sku: String(payload?.sku ?? '').trim(),
    itemName: String(payload?.itemName ?? '').trim(),
    fromWarehouseLocation: String(payload?.fromWarehouseLocation ?? '').trim(),
    toWarehouseLocation: String(payload?.toWarehouseLocation ?? '').trim(),
    quantity: Number(payload?.quantity ?? 0),
    reason: String(payload?.reason ?? '').trim(),
    notes: String(payload?.notes ?? '').trim(),
    createdAt: String(payload?.createdAt ?? '').trim()
  };
}

function mapInventoryTransferSourceSuggestion(data: any): InventoryTransferSourceSuggestion | null {
  const payload = data?.data ?? data ?? null;

  if (!payload) return null;

  return {
    strategy: payload?.strategy === 'fefo' ? 'fefo' : 'fifo',
    inventoryItemId: String(payload?.inventoryItemId ?? '').trim(),
    sku: String(payload?.sku ?? '').trim(),
    itemName: String(payload?.itemName ?? '').trim(),
    unit: String(payload?.unit ?? '').trim(),
    recommendedFromWarehouseLocation: String(payload?.recommendedFromWarehouseLocation ?? '').trim(),
    availableQty: Number(payload?.availableQty ?? 0),
    referenceType: payload?.referenceType === 'batch' ? 'batch' : 'location',
    referenceNo: String(payload?.referenceNo ?? '').trim(),
    expiryDate: payload?.expiryDate ? String(payload.expiryDate).trim() : null,
    receivedDate: payload?.receivedDate ? String(payload.receivedDate).trim() : null,
    notes: String(payload?.notes ?? '').trim()
  };
}

function mapInventoryTransferListResponse(data: any): InventoryTransferListResponse {
  const payload = data?.data ?? data ?? {};
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  const items: InventoryTransferRecord[] = rawItems.map((item: any) => ({
    id: String(item?.id ?? '').trim(),
    inventoryItemId: String(item?.inventoryItemId ?? '').trim(),
    sku: String(item?.sku ?? '').trim(),
    itemName: String(item?.itemName ?? '').trim(),
    fromWarehouseLocation: String(item?.fromWarehouseLocation ?? '').trim(),
    toWarehouseLocation: String(item?.toWarehouseLocation ?? '').trim(),
    quantity: Number(item?.quantity ?? 0),
    reason: String(item?.reason ?? '').trim(),
    notes: String(item?.notes ?? '').trim(),
    createdAt: String(item?.createdAt ?? '').trim()
  }));

  const total = Number.isFinite(Number(payload.total)) ? Number(payload.total) : items.length;

  return { items, total };
}

export const inventoryApi = {
  async getInventoryList(filters: InventoryListFilters = {}): Promise<InventoryListResponse> {
    const response = await apiClient.get<any>(buildInventoryListUrl(filters));
    return mapInventoryListResponse(response.data);
  },

  async getInventoryById(id: string): Promise<InventoryDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.inventory.detail(id));
    return mapInventoryDetailResponse(response.data);
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
    const response = await apiClient.patch<any>(ENDPOINTS.inventory.toggleActive(id), { isActive });
    return mapInventoryItem(response.data);
  },

  async setInventoryActive(id: string, isActive: boolean): Promise<InventoryItemDto> {
    return this.toggleActive(id, isActive);
  },

  async getLocationBalanceSummary(): Promise<InventoryLocationBalanceSummary> {
    const response = await apiClient.get<any>('/inventory/location-balance-summary');
    return mapInventoryLocationBalanceSummary(response.data);
  },

  async getLocationBalances(filters?: {
    inventoryItemId?: string;
    search?: string;
    warehouseLocation?: string;
  }): Promise<InventoryLocationBalanceListResponse> {
    const response = await apiClient.get<any>(buildInventoryLocationBalancesUrl(filters));
    return mapInventoryLocationBalanceListResponse(response.data);
  },

  async getLocationBalancesByInventoryItem(
    inventoryItemId: string
  ): Promise<InventoryLocationBalanceListResponse> {
    const response = await apiClient.get<any>(
      `/inventory/location-balances/${encodeURIComponent(inventoryItemId)}`
    );
    return mapInventoryLocationBalanceListResponse(response.data);
  },

  async createTransferDraft(payload: CreateInventoryTransferDraftRequest): Promise<InventoryTransferDraft> {
    const response = await apiClient.post<any>('/inventory/transfers/draft', payload);
    return mapInventoryTransferDraft(response.data);
  },

  async suggestTransferSource(
    payload: { inventoryItemId: string; quantity: number }
  ): Promise<InventoryTransferSourceSuggestion | null> {
    const response = await apiClient.post<any>('/inventory/transfers/suggest-source', payload);
    return mapInventoryTransferSourceSuggestion(response.data);
  },

  async commitTransfer(payload: CreateInventoryTransferDraftRequest): Promise<any> {
    const response = await apiClient.post<any>('/inventory/transfers/commit', payload);
    return response.data?.data ?? response.data;
  },

  async getTransfers(filters?: InventoryTransferListFilters): Promise<InventoryTransferListResponse> {
    const response = await apiClient.get<any>(buildInventoryTransfersUrl(filters));
    return mapInventoryTransferListResponse(response.data);
  },

  async getTransferById(id: string): Promise<InventoryTransferRecord> {
    const response = await apiClient.get<any>(`/inventory/transfers/${encodeURIComponent(id)}`);
    return mapInventoryTransferRecord(response.data);
  }
};