export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected';
export type PurchaseOrderStatus = 'draft' | 'issued' | 'partially_received' | 'received';
export type GRNStatus = 'draft' | 'posted';

export interface QuotationDto {
  id: string;
  quotationNo: string;
  supplierName: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  status: QuotationStatus;
  createdAt: string;
}

export interface PurchaseOrderDto {
  id: string;
  poNo: string;
  supplierName: string;
  quotationNo?: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  status: PurchaseOrderStatus;
  expectedDate: string;
  createdAt: string;
}

export interface GRNDto {
  id: string;
  grnNo: string;
  poNo: string;
  supplierName: string;
  receivedLines: number;
  receivedQty: number;
  status: GRNStatus;
  postedAt: string;
}

export interface Quotation {
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

export interface PurchaseOrder {
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
}

export interface GRN {
  id: string;
  grnNo: string;
  poNo: string;
  supplierName: string;
  receivedLines: number;
  receivedQty: number;
  status: GRNStatus;
  statusLabel: string;
  postedAt: string;
}

export interface OrdersDashboardSummary {
  quotations: number;
  purchaseOrders: number;
  goodsReceivedNotes: number;
  pendingReceipts: number;
}

export interface OrdersListFilters {
  search?: string;
  status?: string;
}

export interface PurchaseOrderDetailResponse {
  item: PurchaseOrder | null;
}

export interface GRNDetailResponse {
  item: GRN | null;
}

export interface CreatePurchaseOrderRequest {
  supplierName: string;
  quotationNo?: string;
  itemCount: number;
  totalAmount: number;
  currency: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
}

export interface CreateGRNRequest {
  poNo: string;
  supplierName: string;
  receivedLines: number;
  receivedQty: number;
  status: GRNStatus;
}

export interface PurchaseOrderFormValues {
  supplierName: string;
  quotationNo: string;
  itemCount: string;
  totalAmount: string;
  currency: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderFormErrors {
  supplierName?: string;
  quotationNo?: string;
  itemCount?: string;
  totalAmount?: string;
  currency?: string;
  expectedDate?: string;
  status?: string;
}

export interface GRNFormValues {
  poNo: string;
  supplierName: string;
  receivedLines: string;
  receivedQty: string;
  status: GRNStatus;
}

export interface GRNFormErrors {
  poNo?: string;
  supplierName?: string;
  receivedLines?: string;
  receivedQty?: string;
  status?: string;
}