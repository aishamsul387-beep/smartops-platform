export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type InventoryItemType =
  | 'raw_material'
  | 'finished_goods'
  | 'packaging'
  | 'spare_part'
  | 'consumable';

export type InventoryPersistenceMode = 'memory' | 'postgres' | string;

export type InventoryTrackingFlag = 'batch' | 'expiry' | 'serial';

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

export interface InventoryDetailResponse extends InventoryItem {
  trackingFlags: InventoryTrackingFlag[];
}

export interface InventoryItemDto extends InventoryItem {}

export interface InventoryLocationBalanceRecord {
  id: string;
  inventoryItemId: string;
  sku: string;
  itemName: string;
  warehouseLocation: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number;
  unit: string;
  updatedAt: string;
}

export interface InventoryLocationBalanceListResponse {
  items: InventoryLocationBalanceRecord[];
  total: number;
}

export interface InventoryLocationBalanceSummary {
  totalLines: number;
  totalOnHandQty: number;
  totalAvailableQty: number;
}

export interface InventoryTransferDraft {
  inventoryItemId: string;
  sku: string;
  itemName: string;
  unit: string;
  quantity: number;
  fromWarehouseLocation: string;
  toWarehouseLocation: string;
  reason: string;
  notes: string;
  availableSourceBalance: InventoryLocationBalanceRecord | null;
}

export interface CreateInventoryTransferDraftRequest {
  inventoryItemId: string;
  fromWarehouseLocation: string;
  toWarehouseLocation: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface InventoryTransferSourceSuggestion {
  strategy: 'fefo' | 'fifo';
  inventoryItemId: string;
  sku: string;
  itemName: string;
  unit: string;
  recommendedFromWarehouseLocation: string;
  availableQty: number;
  referenceType: 'batch' | 'location';
  referenceNo: string;
  expiryDate: string | null;
  receivedDate: string | null;
  notes: string;
}

export interface InventoryTransferRecord {
  id: string;
  inventoryItemId: string;
  sku: string;
  itemName: string;
  fromWarehouseLocation: string;
  toWarehouseLocation: string;
  quantity: number;
  reason: string;
  notes: string;
  createdAt: string;
}

export interface InventoryTransferListResponse {
  items: InventoryTransferRecord[];
  total: number;
}

export interface InventoryTransferListFilters {
  inventoryItemId?: string;
  search?: string;
  warehouseLocation?: string;
}