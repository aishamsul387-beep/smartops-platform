import type {
  GRN,
  GRNDto,
  GRNStatus,
  PurchaseOrder,
  PurchaseOrderDto,
  PurchaseOrderStatus,
  Quotation,
  QuotationDto,
  QuotationStatus
} from './types';

const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  approved: 'Approved',
  rejected: 'Rejected'
};

const PURCHASE_ORDER_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: 'Draft',
  issued: 'Issued',
  partially_received: 'Partially received',
  received: 'Received'
};

const GRN_STATUS_LABELS: Record<GRNStatus, string> = {
  draft: 'Draft',
  posted: 'Posted'
};

export function mapQuotation(dto: QuotationDto): Quotation {
  return {
    id: dto.id,
    quotationNo: dto.quotationNo,
    supplierName: dto.supplierName,
    itemCount: dto.itemCount,
    totalAmount: dto.totalAmount,
    currency: dto.currency,
    status: dto.status,
    statusLabel: QUOTATION_STATUS_LABELS[dto.status],
    createdAt: dto.createdAt
  };
}

export function mapPurchaseOrder(dto: PurchaseOrderDto): PurchaseOrder {
  return {
    id: dto.id,
    poNo: dto.poNo,
    supplierName: dto.supplierName,
    quotationNo: dto.quotationNo,
    itemCount: dto.itemCount,
    totalAmount: dto.totalAmount,
    currency: dto.currency,
    status: dto.status,
    statusLabel: PURCHASE_ORDER_STATUS_LABELS[dto.status],
    expectedDate: dto.expectedDate,
    createdAt: dto.createdAt
  };
}

export function mapGRN(dto: GRNDto): GRN {
  return {
    id: dto.id,
    grnNo: dto.grnNo,
    poNo: dto.poNo,
    supplierName: dto.supplierName,
    receivedLines: dto.receivedLines,
    receivedQty: dto.receivedQty,
    status: dto.status,
    statusLabel: GRN_STATUS_LABELS[dto.status],
    postedAt: dto.postedAt
  };
}