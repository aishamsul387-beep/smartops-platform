import type {
  WarehouseLocationDto,
  WarehouseLocationFilters,
  WarehouseSummary
} from './types';
import { mapWarehouseLocation } from './mapper';

const MOCK_WAREHOUSE_LOCATIONS: WarehouseLocationDto[] = [
  {
    id: 'wh-001',
    code: 'A-01-01',
    zone: 'A',
    aisle: '01',
    bin: '01',
    capacity: 300,
    occupied: 240,
    itemCount: 12,
    status: 'available',
    updatedAt: '2026-05-21T08:30:00.000Z'
  },
  {
    id: 'wh-002',
    code: 'B-02-04',
    zone: 'B',
    aisle: '02',
    bin: '04',
    capacity: 120,
    occupied: 95,
    itemCount: 7,
    status: 'limited',
    updatedAt: '2026-05-21T09:00:00.000Z'
  },
  {
    id: 'wh-003',
    code: 'C-03-02',
    zone: 'C',
    aisle: '03',
    bin: '02',
    capacity: 80,
    occupied: 80,
    itemCount: 3,
    status: 'full',
    updatedAt: '2026-05-21T09:40:00.000Z'
  },
  {
    id: 'wh-004',
    code: 'D-01-05',
    zone: 'D',
    aisle: '01',
    bin: '05',
    capacity: 200,
    occupied: 60,
    itemCount: 5,
    status: 'available',
    updatedAt: '2026-05-21T10:10:00.000Z'
  }
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: WarehouseLocationDto[], filters?: WarehouseLocationFilters) {
  const search = filters?.search?.trim().toLowerCase();
  const status = filters?.status;

  return items.filter((item) => {
    const matchesSearch =
      !search ||
      item.code.toLowerCase().includes(search) ||
      item.zone.toLowerCase().includes(search) ||
      item.aisle.toLowerCase().includes(search) ||
      item.bin.toLowerCase().includes(search);

    const matchesStatus = !status || status === 'all' || item.status === status;

    return matchesSearch && matchesStatus;
  });
}

export const warehouseApi = {
  async getWarehouseLocations(filters?: WarehouseLocationFilters) {
    await delay(180);
    return applyFilters(MOCK_WAREHOUSE_LOCATIONS, filters).map(mapWarehouseLocation);
  },

  async getWarehouseSummary(): Promise<WarehouseSummary> {
    await delay(140);

    const totalLocations = MOCK_WAREHOUSE_LOCATIONS.length;
    const fullLocations = MOCK_WAREHOUSE_LOCATIONS.filter((item) => item.status === 'full').length;
    const activeLocations = MOCK_WAREHOUSE_LOCATIONS.filter((item) => item.occupied > 0).length;
    const totalCapacity = MOCK_WAREHOUSE_LOCATIONS.reduce((sum, item) => sum + item.capacity, 0);
    const totalOccupied = MOCK_WAREHOUSE_LOCATIONS.reduce((sum, item) => sum + item.occupied, 0);

    return {
      totalLocations,
      activeLocations,
      fullLocations,
      totalCapacity,
      totalOccupied,
      utilizationPercent:
        totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0
    };
  }
};