import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { mapGRN, mapOrdersSummary, mapPurchaseOrder, mapQuotation } from './mapper';
import type {
  CreateGRNRequest,
  CreatePurchaseOrderRequest,
  GRN,
  GRNDetailResponse,
  OrdersDashboardSummary,
  OrdersListFilters,
  PurchaseOrder,
  PurchaseOrderDetailResponse,
  Quotation
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
    return items.map(mapQuotation);
  },

  async getPurchaseOrders(filters?: OrdersListFilters): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<any[]>(
      buildListUrl(ENDPOINTS.orders.purchaseOrders, filters)
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map(mapPurchaseOrder);
  },

  async getPurchaseOrderDetail(id: string): Promise<PurchaseOrderDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.orders.purchaseOrderDetail(id));
    return mapPurchaseOrder(response.data);
  },

  async findPurchaseOrderByNumber(poNo: string): Promise<PurchaseOrder | null> {
    const items = await this.getPurchaseOrders({
      search: poNo,
      status: 'all'
    });

    return items.find((item) => item.poNo === poNo) || null;
  },

  async createPurchaseOrder(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await apiClient.post<any>(ENDPOINTS.orders.createPurchaseOrder, payload);
    return mapPurchaseOrder(response.data);
  },

  async issuePurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.patch<any>(ENDPOINTS.orders.issuePurchaseOrder(id), {});
    return mapPurchaseOrder(response.data);
  },

  async getGoodsReceivedNotes(filters?: OrdersListFilters): Promise<GRN[]> {
    const response = await apiClient.get<any[]>(
      buildListUrl(ENDPOINTS.orders.goodsReceivedNotes, filters)
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map(mapGRN);
  },

  async getGRNDetail(id: string): Promise<GRNDetailResponse> {
    const response = await apiClient.get<any>(ENDPOINTS.orders.goodsReceivedNoteDetail(id));
    return mapGRN(response.data);
  },

  async findGRNByNumber(grnNo: string): Promise<GRN | null> {
    const items = await this.getGoodsReceivedNotes({
      search: grnNo,
      status: 'all'
    });

    return items.find((item) => item.grnNo === grnNo) || null;
  },

  async createGRN(payload: CreateGRNRequest): Promise<GRN> {
    const response = await apiClient.post<any>(ENDPOINTS.orders.createGoodsReceivedNote, payload);
    return mapGRN(response.data);
  },

  async postGRN(id: string): Promise<GRN> {
    const current = await this.getGRNDetail(id);

    if (current.status === 'posted') {
      return current;
    }

    throw new Error(
      'Post GRN action is not enabled in the current backend flow. Create GRN using status "posted" instead.'
    );
  }
};