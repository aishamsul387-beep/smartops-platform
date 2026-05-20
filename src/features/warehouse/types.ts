export type WarehouseLocationStatus = 'available' | 'limited' | 'full';

export interface WarehouseLocationDto {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  bin: string;
  capacity: number;
  occupied: number;
  itemCount: number;
  status: WarehouseLocationStatus;
  updatedAt: string;
}

export interface WarehouseLocation {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  bin: string;
  capacity: number;
  occupied: number;
  itemCount: number;
  status: WarehouseLocationStatus;
  statusLabel: string;
  utilizationPercent: number;
  updatedAt: string;
}

export interface WarehouseLocationFilters {
  search?: string;
  status?: WarehouseLocationStatus | 'all';
}

export interface WarehouseSummary {
  totalLocations: number;
  activeLocations: number;
  fullLocations: number;
  totalCapacity: number;
  totalOccupied: number;
  utilizationPercent: number;
}