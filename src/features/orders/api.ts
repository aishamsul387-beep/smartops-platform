import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { mapGRN, mapOrdersSummary, mapPurchaseOrder, mapQuotation } from './mapper';
import type {
  CreateGRNRequest,
  CreatePurchaseOrderRequest,
  GRN,
  GRNDetailResponse,
  GRNDto,
  OrdersDashboardSummary,
  OrdersListFilters,
  PurchaseOrder,
  PurchaseOrderDetailResponse,
  PurchaseOrderDto,
  Quotation,
  QuotationDto
} from './types';

function buildListUrl(basePath: string, filters?: OrdersListFilters) {
  const query = new URLSearchParams();

  if (filters?.search && filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters?.status && filters.status.trim() && filters.status !== 'all') {
    query.set('status', filters.status.trim());
  }

  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export const ordersApi = {
  async getOrdersDashboardSummary(): Promise<OrdersDashboardSummary> {
    const response = await apiClient.get<any>(ENDPOINTS.orders.summary);
    return mapOrdersSummary(response.data);
  },

  async getQuotations(filters?: OrdersListFilters): Promise<Quotation[]> {
    const response = await apiClient.get<any[]>(
      buildListUrl(ENDPOINTS.orders.quotations, filters)
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map((item) => mapQuotation(item) as QuotationDto);
  },

  async getPurchaseOrders(filters?: OrdersListFilters): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<any[]>(
      buildListUrl(ENDPOINTS.orders.purchaseOrders, filters)
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map((item) => mapPurchaseOrder(item) as PurchaseOrderDto);
  },

  async getPurchaseOrderDetail(id: string): Promise<PurchaseOrderDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.orders.purchaseOrderDetail(id));
    return mapPurchaseOrder(response.data);
  },

  async createPurchaseOrder(
    payload: CreatePurchaseOrderRequest
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<any>(ENDPOINTS.orders.createPurchaseOrder, payload);
    return mapPurchaseOrder(response.data);
  },

  async getGoodsReceivedNotes(filters?: OrdersListFilters): Promise<GRN[]> {
    const response = await apiClient.get<any[]>(
      buildListUrl(ENDPOINTS.orders.goodsReceivedNotes, filters)
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map((item) => mapGRN(item) as GRNDto);
  },

  async getGRNDetail(id: string): Promise<GRNDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.orders.goodsReceivedNoteDetail(id));
    return mapGRN(response.data);
  },

  async createGRN(payload: CreateGRNRequest): Promise<GRN> {
    const response = await apiClient.post<any>(ENDPOINTS.orders.createGoodsReceivedNote, payload);
    return mapGRN(response.data);
  }
};