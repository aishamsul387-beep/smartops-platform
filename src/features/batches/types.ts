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