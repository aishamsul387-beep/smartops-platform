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

const MOCK_QUOTATIONS: QuotationDto[] = [
  {
    id: 'qt-001',
    quotationNo: 'QT-2026-001',
    supplierName: 'Prime Steel Supply',
    itemCount: 4,
    totalAmount: 12500,
    currency: 'USD',
    status: 'sent',
    createdAt: '2026-05-21T08:00:00.000Z'
  },
  {
    id: 'qt-002',
    quotationNo: 'QT-2026-002',
    supplierName: 'PackRight Industries',
    itemCount: 2,
    totalAmount: 1800,
    currency: 'USD',
    status: 'approved',
    createdAt: '2026-05-21T09:15:00.000Z'
  },
  {
    id: 'qt-003',
    quotationNo: 'QT-2026-003',
    supplierName: 'ValveCore Manufacturing',
    itemCount: 6,
    totalAmount: 9300,
    currency: 'USD',
    status: 'draft',
    createdAt: '2026-05-21T10:45:00.000Z'
  }
];

let mockPurchaseOrders: PurchaseOrderDto[] = [
  {
    id: 'po-001',
    poNo: 'PO-2026-001',
    supplierName: 'Prime Steel Supply',
    quotationNo: 'QT-2026-001',
    itemCount: 4,
    totalAmount: 12500,
    currency: 'USD',
    status: 'issued',
    expectedDate: '2026-05-25T00:00:00.000Z',
    createdAt: '2026-05-21T11:20:00.000Z'
  },
  {
    id: 'po-002',
    poNo: 'PO-2026-002',
    supplierName: 'PackRight Industries',
    quotationNo: 'QT-2026-002',
    itemCount: 2,
    totalAmount: 1800,
    currency: 'USD',
    status: 'partially_received',
    expectedDate: '2026-05-24T00:00:00.000Z',
    createdAt: '2026-05-21T12:10:00.000Z'
  },
  {
    id: 'po-003',
    poNo: 'PO-2026-003',
    supplierName: 'ValveCore Manufacturing',
    quotationNo: 'QT-2026-003',
    itemCount: 6,
    totalAmount: 9300,
    currency: 'USD',
    status: 'draft',
    expectedDate: '2026-05-28T00:00:00.000Z',
    createdAt: '2026-05-21T13:00:00.000Z'
  }
];

let mockGRNs: GRNDto[] = [
  {
    id: 'grn-001',
    grnNo: 'GRN-2026-001',
    poNo: 'PO-2026-002',
    supplierName: 'PackRight Industries',
    receivedLines: 1,
    receivedQty: 35,
    status: 'posted',
    postedAt: '2026-05-21T14:30:00.000Z'
  },
  {
    id: 'grn-002',
    grnNo: 'GRN-2026-002',
    poNo: 'PO-2026-001',
    supplierName: 'Prime Steel Supply',
    receivedLines: 0,
    receivedQty: 0,
    status: 'draft',
    postedAt: '2026-05-21T15:10:00.000Z'
  }
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesSearch(values: string[], search?: string) {
  if (!search?.trim()) {
    return true;
  }

  const normalized = search.trim().toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalized));
}

function nextPONumber() {
  return `PO-${new Date().getFullYear()}-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`;
}

function nextGRNNumber() {
  return `GRN-${new Date().getFullYear()}-${String(mockGRNs.length + 1).padStart(3, '0')}`;
}

export const ordersApi = {
  async getOrdersDashboardSummary(): Promise<OrdersDashboardSummary> {
    await delay(140);

    return {
      quotations: MOCK_QUOTATIONS.length,
      purchaseOrders: mockPurchaseOrders.length,
      goodsReceivedNotes: mockGRNs.length,
      pendingReceipts: mockPurchaseOrders.filter(
        (item) => item.status === 'issued' || item.status === 'partially_received'
      ).length
    };
  },

  async getQuotations(filters?: OrdersListFilters): Promise<Quotation[]> {
    await delay(180);

    return MOCK_QUOTATIONS
      .filter((item) => {
        const okSearch = matchesSearch(
          [item.quotationNo, item.supplierName, item.status],
          filters?.search
        );
        const okStatus =
          !filters?.status || filters.status === 'all' || item.status === filters.status;
        return okSearch && okStatus;
      })
      .map(mapQuotation);
  },

  async getPurchaseOrders(filters?: OrdersListFilters): Promise<PurchaseOrder[]> {
    await delay(180);

    return mockPurchaseOrders
      .filter((item) => {
        const okSearch = matchesSearch(
          [item.poNo, item.supplierName, item.quotationNo || '', item.status],
          filters?.search
        );
        const okStatus =
          !filters?.status || filters.status === 'all' || item.status === filters.status;
        return okSearch && okStatus;
      })
      .map(mapPurchaseOrder);
  },

  async getPurchaseOrderById(id: string): Promise<PurchaseOrderDetailResponse> {
    await delay(150);

    const found = mockPurchaseOrders.find((item) => item.id === id);

    return {
      item: found ? mapPurchaseOrder(found) : null
    };
  },

  async createPurchaseOrder(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    await delay(180);

    const dto: PurchaseOrderDto = {
      id: `po-${Date.now()}`,
      poNo: nextPONumber(),
      supplierName: payload.supplierName,
      quotationNo: payload.quotationNo || undefined,
      itemCount: payload.itemCount,
      totalAmount: payload.totalAmount,
      currency: payload.currency,
      status: payload.status,
      expectedDate: payload.expectedDate,
      createdAt: new Date().toISOString()
    };

    mockPurchaseOrders = [dto, ...mockPurchaseOrders];
    return mapPurchaseOrder(dto);
  },

  async getGoodsReceivedNotes(filters?: OrdersListFilters): Promise<GRN[]> {
    await delay(180);

    return mockGRNs
      .filter((item) => {
        const okSearch = matchesSearch(
          [item.grnNo, item.poNo, item.supplierName, item.status],
          filters?.search
        );
        const okStatus =
          !filters?.status || filters.status === 'all' || item.status === filters.status;
        return okSearch && okStatus;
      })
      .map(mapGRN);
  },

  async getGRNById(id: string): Promise<GRNDetailResponse> {
    await delay(150);

    const found = mockGRNs.find((item) => item.id === id);

    return {
      item: found ? mapGRN(found) : null
    };
  },

  async createGRN(payload: CreateGRNRequest): Promise<GRN> {
    await delay(180);

    const dto: GRNDto = {
      id: `grn-${Date.now()}`,
      grnNo: nextGRNNumber(),
      poNo: payload.poNo,
      supplierName: payload.supplierName,
      receivedLines: payload.receivedLines,
      receivedQty: payload.receivedQty,
      status: payload.status,
      postedAt: new Date().toISOString()
    };

    mockGRNs = [dto, ...mockGRNs];
    return mapGRN(dto);
  }
};