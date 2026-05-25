export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type InventoryItemType =
  | 'raw_material'
  | 'finished_goods'
  | 'packaging'
  | 'spare_part'
  | 'consumable';

export type InventoryPersistenceMode = 'memory' | 'postgres' | string;

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  itemType: InventoryItemType;
  brand: string;
  model: string;
  preferredSupplierName: string;
  standardCost: number;
  averageCost: number;
  currency: string;
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

export interface InventoryListResponse {
  items: InventoryItem[];
  total: number;
  persistenceMode?: InventoryPersistenceMode;
}

export interface CreateInventoryRequest {
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  itemType: InventoryItemType;
  brand: string;
  model: string;
  preferredSupplierName: string;
  standardCost: number;
  averageCost: number;
  currency: string;
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

export interface UpdateInventoryRequest extends CreateInventoryRequest {
  id: string;
}

export interface InventoryListFilters {
  search?: string;
  status?: 'all' | InventoryStatus;
}

export interface InventoryFormValues {
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  itemType?: InventoryItemType;
  brand?: string;
  model?: string;
  preferredSupplierName?: string;
  standardCost?: string;
  averageCost?: string;
  currency?: string;
  quantity: string;
  reorderLevel: string;
  minimumStockLevel: string;
  maximumStockLevel: string;
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

export type InventoryFormErrors = Partial<Record<keyof InventoryFormValues, string>>;

export interface InventoryRelatedBatch {
  id: string;
  inventoryItemId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  supplierName: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  receivedQty: number;
  availableQty: number;
  expiryDate: string | null;
  batchStatus: string;
}

export type InventoryItemDto = InventoryItem;
export type InventoryDetailResponse = InventoryItem;
export type InventoryCreateRequest = CreateInventoryRequest;
export type InventoryUpdateRequest = UpdateInventoryRequest;
export type InventoryListParams = InventoryListFilters;