import type {
  GRNRecord,
  OrdersDashboardSummary,
  PurchaseOrderLineRecord,
  PurchaseOrderPlanningContext,
  PurchaseOrderRecord,
  PurchaseOrderStatus,
  QuotationRecord,
  QuotationStatus,
  SupplierSource
} from './types';

function asText(value: unknown, fallback = '') {
  return String(value ?? fallback);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getQuotationStatusLabel(status: QuotationStatus) {
  if (status === 'sent') return 'Sent';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Draft';
}

function getPurchaseOrderStatusLabel(status: PurchaseOrderStatus) {
  if (status === 'issued') return 'Issued';
  if (status === 'partially_received') return 'Partially Received';
  if (status === 'received') return 'Received';
  return 'Draft';
}

function getGRNStatusLabel(status: GRNRecord['status']) {
  if (status === 'posted') return 'Posted';
  return 'Draft';
}

function mapPlanningContext(payload: any): PurchaseOrderPlanningContext | null {
  if (!payload) {
    return null;
  }

  return {
    planningSource: 'stock_control',
    inventoryItemId: asText(payload.inventoryItemId),
    itemCode: asText(payload.itemCode),
    itemName: asText(payload.itemName),
    suggestedOrderQty: asNumber(payload.suggestedOrderQty, 0),
    supplierSource: asText(payload.supplierSource, 'unassigned') as SupplierSource,
    estimatedReorderValue: asNumber(payload.estimatedReorderValue, 0),
    reorderByDate: asText(payload.reorderByDate)
  };
}

function mapPurchaseOrderLine(payload: any): PurchaseOrderLineRecord {
  return {
    id: asText(payload?.id),
    lineNo: asNumber(payload?.lineNo, 0),
    inventoryItemId: asText(payload?.inventoryItemId),
    itemCode: asText(payload?.itemCode),
    itemName: asText(payload?.itemName),
    orderedQty: asNumber(payload?.orderedQty, 0),
    unitCost: asNumber(payload?.unitCost, 0),
    currency: asText(payload?.currency, 'USD'),
    lineTotal: asNumber(payload?.lineTotal, 0),
    notes: asText(payload?.notes)
  };
}

export function mapQuotation(payload: any): QuotationRecord {
  const status = asText(payload?.status, 'draft') as QuotationStatus;

  return {
    id: asText(payload?.id),
    quotationNo: asText(payload?.quotationNo),
    supplierName: asText(payload?.supplierName),
    itemCount: asNumber(payload?.itemCount, 0),
    totalAmount: asNumber(payload?.totalAmount, 0),
    currency: asText(payload?.currency, 'USD'),
    status,
    statusLabel: getQuotationStatusLabel(status),
    createdAt: asText(payload?.createdAt)
  };
}

export function mapPurchaseOrder(payload: any): PurchaseOrderRecord {
  const status = asText(payload?.status, 'draft') as PurchaseOrderStatus;

  return {
    id: asText(payload?.id),
    poNo: asText(payload?.poNo),
    supplierName: asText(payload?.supplierName),
    quotationNo: payload?.quotationNo ? asText(payload?.quotationNo) : undefined,
    itemCount: asNumber(payload?.itemCount, 0),
    totalAmount: asNumber(payload?.totalAmount, 0),
    currency: asText(payload?.currency, 'USD'),
    status,
    statusLabel: getPurchaseOrderStatusLabel(status),
    expectedDate: asText(payload?.expectedDate),
    createdAt: asText(payload?.createdAt),
    planningContext: mapPlanningContext(payload?.planningContext),
    lines: Array.isArray(payload?.lines) ? payload.lines.map(mapPurchaseOrderLine) : []
  };
}

export function mapGRN(payload: any): GRNRecord {
  const status = asText(payload?.status, 'draft') as GRNRecord['status'];

  return {
    id: asText(payload?.id),
    grnNo: asText(payload?.grnNo),
    poNo: asText(payload?.poNo),
    inventoryItemId: asText(payload?.inventoryItemId),
    supplierName: asText(payload?.supplierName),
    batchNumber: asText(payload?.batchNumber),
    lotNumber: asText(payload?.lotNumber),
    supplierLotNumber: asText(payload?.supplierLotNumber),
    manufactureDate: payload?.manufactureDate ? asText(payload?.manufactureDate) : null,
    expiryDate: payload?.expiryDate ? asText(payload?.expiryDate) : null,
    receivedDate: payload?.receivedDate ? asText(payload?.receivedDate) : null,
    receivedLines: asNumber(payload?.receivedLines, 0),
    receivedQty: asNumber(payload?.receivedQty, 0),
    status,
    statusLabel: getGRNStatusLabel(status),
    warehouseLocation: asText(payload?.warehouseLocation),
    zone: asText(payload?.zone),
    aisle: asText(payload?.aisle),
    levelCode: asText(payload?.levelCode),
    bin: asText(payload?.bin),
    linkedBatchId: payload?.linkedBatchId ? asText(payload?.linkedBatchId) : null,
    postedAt: asText(payload?.postedAt)
  };
}

export function mapOrdersSummary(payload: any): OrdersDashboardSummary {
  return {
    quotations: asNumber(payload?.quotations, 0),
    purchaseOrders: asNumber(payload?.purchaseOrders, 0),
    goodsReceivedNotes: asNumber(payload?.goodsReceivedNotes, 0),
    pendingReceipts: asNumber(payload?.pendingReceipts, 0)
  };
}