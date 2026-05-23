export type BatchStatus = 'available' | 'blocked' | 'quarantine' | 'expired' | 'consumed';

export interface BatchRecord {
  id: string;
  inventoryItemId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  supplierName: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  unitCost: number;
  currency: string;
  receivedQty: number;
  availableQty: number;
  reservedQty: number;
  blockedQty: number;
  qaHoldQty: number;
  batchStatus: BatchStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  notes: string;
  updatedAt: string;
}

export interface BatchListFilters {
  inventoryItemId?: string;
  status?: BatchStatus | 'all';
  search?: string;
}

export interface BatchListResponse {
  items: BatchRecord[];
  total: number;
  persistenceMode?: string;
}

export interface CreateBatchRequest {
  inventoryItemId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  supplierName: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  unitCost: number;
  currency: string;
  receivedQty: number;
  availableQty: number;
  reservedQty: number;
  blockedQty: number;
  qaHoldQty: number;
  batchStatus: BatchStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  notes: string;
}

export interface BatchFormValues {
  inventoryItemId: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string;
  expiryDate: string;
  receivedDate: string;
  supplierName: string;
  purchaseOrderNo: string;
  goodsReceivedNoteNo: string;
  unitCost: string;
  currency: string;
  receivedQty: string;
  availableQty: string;
  batchStatus: BatchStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  notes: string;
}

export interface BatchFormErrors {
  inventoryItemId?: string;
  batchNumber?: string;
  unitCost?: string;
  receivedQty?: string;
  availableQty?: string;
  batchStatus?: string;
}

export const initialBatchFormValues: BatchFormValues = {
  inventoryItemId: '',
  batchNumber: '',
  lotNumber: '',
  supplierLotNumber: '',
  manufactureDate: '',
  expiryDate: '',
  receivedDate: '',
  supplierName: '',
  purchaseOrderNo: '',
  goodsReceivedNoteNo: '',
  unitCost: '0',
  currency: 'USD',
  receivedQty: '0',
  availableQty: '0',
  batchStatus: 'available',
  warehouseLocation: '',
  zone: '',
  aisle: '',
  levelCode: '',
  bin: '',
  notes: ''
};