import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  CreateInventoryRequest,
  InventoryItemDto,
  InventoryListFilters,
  InventoryListResponse,
  InventoryDetailResponse
} from './types';
import { mapInventoryItem } from './mapper';

let mockInventoryStore: InventoryItemDto[] = [
  {
    id: 'inv-001',
    sku: 'RM-STEEL-001',
    name: 'Steel Sheet A',
    category: 'Raw Material',
    quantity: 240,
    reorderLevel: 80,
    unit: 'pcs',
    warehouseLocation: 'A-01-01',
    status: 'in_stock',
    updatedAt: '2026-05-20T08:30:00.000Z'
  },
  {
    id: 'inv-002',
    sku: 'PK-BOX-010',
    name: 'Carton Box Medium',
    category: 'Packaging',
    quantity: 35,
    reorderLevel: 50,
    unit: 'box',
    warehouseLocation: 'B-02-04',
    status: 'low_stock',
    updatedAt: '2026-05-20T09:00:00.000Z'
  },
  {
    id: 'inv-003',
    sku: 'FG-VALVE-221',
    name: 'Control Valve X',
    category: 'Finished Goods',
    quantity: 0,
    reorderLevel: 20,
    unit: 'pcs',
    warehouseLocation: 'C-03-02',
    status: 'out_of_stock',
    updatedAt: '2026-05-20T10:15:00.000Z'
  }
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: InventoryItemDto[], filters?: InventoryListFilters) {
  const search = filters?.search?.trim().toLowerCase();
  const status = filters?.status;

  return items.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

    const matchesStatus = !status || status === 'all' || item.status === status;

    return matchesSearch && matchesStatus;
  });
}

export const inventoryApi = {
  async getInventoryList(filters?: InventoryListFilters): Promise<InventoryListResponse> {
    void ENDPOINTS.inventory.list;
    await delay(200);

    const filtered = applyFilters(mockInventoryStore, filters).map(mapInventoryItem);

    return {
      items: filtered,
      total: filtered.length
    };
  },

  async getInventoryById(id: string): Promise<InventoryDetailResponse> {
    void ENDPOINTS.inventory.detail(id);
    await delay(150);

    const found = mockInventoryStore.find((item) => item.id === id);

    return {
      item: found ? mapInventoryItem(found) : null
    };
  },

  async createInventory(payload: CreateInventoryRequest) {
    void ENDPOINTS.inventory.create;
    await delay(200);

    const nextId = `inv-${Date.now()}`;
    const dto: InventoryItemDto = {
      id: nextId,
      sku: payload.sku,
      name: payload.name,
      category: payload.category,
      quantity: payload.quantity,
      reorderLevel: payload.reorderLevel,
      unit: payload.unit,
      warehouseLocation: payload.warehouseLocation,
      status: payload.status,
      updatedAt: new Date().toISOString()
    };

    mockInventoryStore = [dto, ...mockInventoryStore];

    return mapInventoryItem(dto);
  }
};