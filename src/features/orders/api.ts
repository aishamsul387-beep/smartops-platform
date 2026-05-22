import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
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
import { mapGRN, mapPurchaseOrder, mapQuotation } from './mapper';

export const ordersApi = {
  async getOrdersDashboardSummary(): Promise<OrdersDashboardSummary> {
    const response = await apiClient.get<OrdersDashboardSummary>(ENDPOINTS.orders.summary);
    return response.data;
  },

  async getQuotations(filters?: OrdersListFilters): Promise<Quotation[]> {
    const response = await apiClient.get<QuotationDto[]>(ENDPOINTS.orders.quotations, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    return (response.data || []).map(mapQuotation);
  },

  async getPurchaseOrders(filters?: OrdersListFilters): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<PurchaseOrderDto[]>(ENDPOINTS.orders.purchaseOrders, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    return (response.data || []).map(mapPurchaseOrder);
  },

  async getPurchaseOrderById(id: string): Promise<PurchaseOrderDetailResponse> {
    const response = await apiClient.get<PurchaseOrderDto>(ENDPOINTS.orders.purchaseOrderDetail(id));

    return {
      item: response.data ? mapPurchaseOrder(response.data) : null
    };
  },

  async createPurchaseOrder(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrderDto>(
      ENDPOINTS.orders.createPurchaseOrder,
      payload
    );

    return mapPurchaseOrder(response.data);
  },

  async getGoodsReceivedNotes(filters?: OrdersListFilters): Promise<GRN[]> {
    const response = await apiClient.get<GRNDto[]>(ENDPOINTS.orders.goodsReceivedNotes, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all'
      }
    });

    return (response.data || []).map(mapGRN);
  },

  async getGRNById(id: string): Promise<GRNDetailResponse> {
    const response = await apiClient.get<GRNDto>(ENDPOINTS.orders.goodsReceivedNoteDetail(id));

    return {
      item: response.data ? mapGRN(response.data) : null
    };
  },

  async createGRN(payload: CreateGRNRequest): Promise<GRN> {
    const response = await apiClient.post<GRNDto>(
      ENDPOINTS.orders.createGoodsReceivedNote,
      payload
    );

    return mapGRN(response.data);
  }
};