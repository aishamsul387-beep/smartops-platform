export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItemDto {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  statusLabel: string;
  updatedAt: string;
}

export interface InventoryListFilters {
  search?: string;
  status?: InventoryStatus | 'all';
}

export interface InventoryListResponse {
  items: InventoryItem[];
  total: number;
}

export interface CreateInventoryRequest {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
}

export interface InventoryDetailResponse {
  item: InventoryItem | null;
}