export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItemDto {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  isActive: boolean;
  isBatchTracked: boolean;
  isExpiryTracked: boolean;
  isSerialTracked: boolean;
  baseUomCode: string;
  purchaseUomCode: string;
  salesUomCode: string;
  issueUomCode: string;
  uomConversionGroupCode: string;
  allowsFraction: boolean;
  notes: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  statusLabel: string;
  isActive: boolean;
  isBatchTracked: boolean;
  isExpiryTracked: boolean;
  isSerialTracked: boolean;
  baseUomCode: string;
  purchaseUomCode: string;
  salesUomCode: string;
  issueUomCode: string;
  uomConversionGroupCode: string;
  allowsFraction: boolean;
  notes: string;
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
  barcode: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  isActive: boolean;
  isBatchTracked: boolean;
  isExpiryTracked: boolean;
  isSerialTracked: boolean;
  baseUomCode: string;
  purchaseUomCode: string;
  salesUomCode: string;
  issueUomCode: string;
  uomConversionGroupCode: string;
  allowsFraction: boolean;
  notes: string;
}

export interface InventoryDetailResponse {
  item: InventoryItem | null;
}