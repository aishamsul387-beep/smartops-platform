export type WarehouseLocationStatus = 'empty' | 'occupied' | 'blocked';
export type WarehouseLocationType =
  | 'rack'
  | 'floor'
  | 'bulk'
  | 'staging'
  | 'quarantine'
  | 'shelves'
  | 'island';

export type WarehouseCapacityUom = 'pallet' | 'pcs' | 'carton';
export type WarehouseSiteScope = 'all' | 'warehouse' | 'outlet';

export interface WarehouseLocationRecord {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  locationType: WarehouseLocationType;
  status: WarehouseLocationStatus;
  capacityUom: WarehouseCapacityUom;
  palletCapacity: number;
  usedPalletCapacity: number;
  cubicCapacityM3: number;
  usedCubicCapacityM3: number;
  isActive: boolean;
  notes: string;
  updatedAt: string;
}

export interface WarehouseLocationListResponse {
  items: WarehouseLocationRecord[];
  total: number;
}

export interface WarehouseLocationImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{
    rowNumber: number;
    message: string;
  }>;
}

export interface WarehouseUtilizationSummary {
  siteScope: WarehouseSiteScope;
  warehouseCode: string | null;
  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
  emptyLocations: number;
  occupiedLocations: number;
  blockedLocations: number;
  fullLocations: number;
  fullLocationPct: number;
  palletCapacityTotal: number;
  palletCapacityUsed: number;
  palletUtilizationPct: number;
  pcsCapacityTotal: number;
  pcsCapacityUsed: number;
  pcsUtilizationPct: number;
  cartonCapacityTotal: number;
  cartonCapacityUsed: number;
  cartonUtilizationPct: number;
  updatedAt: string;
}

export interface WarehouseLocationListFilters {
  search?: string;
  locationCode?: string;
  status?: 'all' | WarehouseLocationStatus;
  type?: 'all' | WarehouseLocationType;
  active?: 'all' | 'active' | 'inactive';
}

export interface CreateWarehouseLocationRequest {
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  locationType: WarehouseLocationType;
  status: WarehouseLocationStatus;
  capacityUom: WarehouseCapacityUom;
  palletCapacity: number;
  usedPalletCapacity: number;
  cubicCapacityM3: number;
  usedCubicCapacityM3: number;
  isActive: boolean;
  notes: string;
}

export interface UpdateWarehouseLocationRequest extends CreateWarehouseLocationRequest {
  id: string;
}

export interface WarehouseLocationFormValues {
  warehouseCode: string;
  warehouseName: string;
  locationCode: string;
  zone: string;
  aisle: string;
  levelCode: string;
  bin: string;
  locationType: WarehouseLocationType;
  status: WarehouseLocationStatus;
  capacityUom: WarehouseCapacityUom;
  palletCapacity: string;
  usedPalletCapacity: string;
  cubicCapacityM3: string;
  usedCubicCapacityM3: string;
  isActive: boolean;
  notes: string;
}

export type WarehouseLocationFormErrors = Partial<Record<keyof WarehouseLocationFormValues, string>>;
