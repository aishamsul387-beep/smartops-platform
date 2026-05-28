export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected';
export type PurchaseOrderStatus = 'draft' | 'issued' | 'partially_received' | 'received';
export type GRNStatus = 'draft' | 'posted';
export type SupplierSource = 'inventory_master' | 'batch_history' | 'unassigned';
export type PlanningSource = 'stock_control';

export interface OrdersListFilters {
  search?: string;
  status?: string;
}

export interface QuotationRecord {
  id: string;
  quotationNo: string;
  supplierName: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  status: QuotationStatus;
  statusLabel: string;
  createdAt: string;
}

export interface PurchaseOrderPlanningContext {
  planningSource: PlanningSource;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  suggestedOrderQty: number;
  supplierSource: SupplierSource;
  estimatedReorderValue: number;
  reorderByDate: string;
}

export interface PurchaseOrderLineRecord {
  id: string;
  lineNo: number;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
  currency: string;
  lineTotal: number;
  notes: string;
}

export interface PurchaseOrderRecord {
  id: string;
  poNo: string;
  supplierName: string;
  quotationNo?: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  status: PurchaseOrderStatus;
  statusLabel: string;
  expectedDate: string;
  createdAt: string;
  planningContext: PurchaseOrderPlanningContext | null;
  lines: PurchaseOrderLineRecord[];
}

export interface GRNRecord {
  id: string;
  grnNo: string;
  poNo: string;
  purchaseOrderLineId: string;
  inventoryItemId: string;
  supplierName: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  receivedLines: number;
  receivedQty: number;
  status: GRNStatus;
  statusLabel: string;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  linkedBatchId: string | null;
  postedAt: string;
}

export interface OrdersDashboardSummary {
  quotations: number;
  purchaseOrders: number;
  goodsReceivedNotes: number;
  pendingReceipts: number;
}

export interface CreatePurchaseOrderLineRequest {
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  unitCost: number;
  currency: string;
  lineTotal?: number;
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierName: string;
  quotationNo?: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
  lines?: CreatePurchaseOrderLineRequest[];
}

export interface CreateGRNRequest {
  poNo: string;
  purchaseOrderLineId: string;
  inventoryItemId: string;
  supplierName: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
  receivedDate: string | null;
  receivedLines: number;
  receivedQty: number;
  status: GRNStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
}

export interface PurchaseOrderFormLineValues {
  inventoryItemId: string;
  orderedQty: string;
  unitCost: string;
  notes: string;
}

export interface PurchaseOrderFormValues {
  supplierName: string;
  quotationNo: string;
  currency: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
  lines: PurchaseOrderFormLineValues[];
}

export interface PurchaseOrderFormErrors
  extends Partial<Record<Exclude<keyof PurchaseOrderFormValues, 'lines'>, string>> {
  lines?: string;
  lineErrors?: Array<Partial<Record<keyof PurchaseOrderFormLineValues, string>>>;
}

export interface GRNFormValues {
  poNo: string;
  purchaseOrderLineId: string;
  inventoryItemId: string;
  supplierName: string;
  batchNumber: string;
  lotNumber: string;
  supplierLotNumber: string;
  manufactureDate: string;
  expiryDate: string;
  receivedDate: string;
  receivedLines: string;
  receivedQty: string;
  status: GRNStatus;
  warehouseLocation: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
}

export type GRNFormErrors = Partial<Record<keyof GRNFormValues, string>>;

export type Quotation = QuotationRecord;
export type QuotationDto = QuotationRecord;
export type PurchaseOrder = PurchaseOrderRecord;
export type PurchaseOrderDto = PurchaseOrderRecord;
export type PurchaseOrderDetailResponse = PurchaseOrderRecord;
export type GRN = GRNRecord;
export type GRNDto = GRNRecord;
export type GRNDetailResponse = GRNRecord;