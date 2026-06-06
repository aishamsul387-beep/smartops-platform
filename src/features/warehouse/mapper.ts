import type {
  WarehouseAlertSeverity,
  WarehouseCapacityUom,
  WarehouseLocationAlertRecord,
  WarehouseLocationAlertSummary,
  WarehouseLocationListResponse,
  WarehouseLocationRecord,
  WarehouseLocationStatus,
  WarehouseLocationType,
  WarehouseSiteScope,
  WarehouseSiteType,
  WarehouseUtilizationDrilldown,
  WarehouseUtilizationDrilldownBucket,
  WarehouseUtilizationSummary
} from './types';

const allowedStatuses: WarehouseLocationStatus[] = ['empty', 'occupied', 'blocked'];
const allowedTypes: WarehouseLocationType[] = [
  'rack',
  'floor',
  'bulk',
  'staging',
  'quarantine',
  'shelves',
  'island'
];
const allowedCapacityUom: WarehouseCapacityUom[] = ['pallet', 'pcs', 'carton'];
const allowedSiteScopes: WarehouseSiteScope[] = ['all', 'warehouse', 'outlet'];
const allowedAlertSeverities: WarehouseAlertSeverity[] = ['near_full', 'full'];

function extractPayload<T = any>(value: any): T {
  if (value && typeof value === 'object' && 'data' in value && value.data !== undefined) {
    return value.data as T;
  }

  return value as T;
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

function normalizeNullableText(value: unknown) {
  const text = String(value ?? '').trim();
  return text ? text : null;
}

function normalizeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'active';
}

function normalizeStatus(value: unknown): WarehouseLocationStatus {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseLocationStatus;
  return allowedStatuses.includes(normalized) ? normalized : 'empty';
}

function normalizeType(value: unknown): WarehouseLocationType {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseLocationType;
  return allowedTypes.includes(normalized) ? normalized : 'rack';
}

function normalizeCapacityUom(value: unknown): WarehouseCapacityUom {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseCapacityUom;
  return allowedCapacityUom.includes(normalized) ? normalized : 'pallet';
}

function normalizeSiteScope(value: unknown): WarehouseSiteScope {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseSiteScope;
  return allowedSiteScopes.includes(normalized) ? normalized : 'all';
}

function normalizeSiteType(value: unknown): WarehouseSiteType {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseSiteType;
  return normalized === 'outlet' ? 'outlet' : 'warehouse';
}

function normalizeAlertSeverity(value: unknown): WarehouseAlertSeverity {
  const normalized = String(value ?? '').trim().toLowerCase() as WarehouseAlertSeverity;
  return allowedAlertSeverities.includes(normalized) ? normalized : 'near_full';
}

function mapWarehouseUtilizationDrilldownBucket(data: any): WarehouseUtilizationDrilldownBucket {
  const source = data ?? {};

  return {
    key: normalizeText(source.key),
    label: normalizeText(source.label),
    totalLocations: normalizeNumber(source.totalLocations),
    activeLocations: normalizeNumber(source.activeLocations),
    inactiveLocations: normalizeNumber(source.inactiveLocations),
    emptyLocations: normalizeNumber(source.emptyLocations),
    occupiedLocations: normalizeNumber(source.occupiedLocations),
    blockedLocations: normalizeNumber(source.blockedLocations),
    fullLocations: normalizeNumber(source.fullLocations),
    fullLocationPct: normalizeNumber(source.fullLocationPct),
    palletCapacityTotal: normalizeNumber(source.palletCapacityTotal),
    palletCapacityUsed: normalizeNumber(source.palletCapacityUsed),
    palletUtilizationPct: normalizeNumber(source.palletUtilizationPct),
    pcsCapacityTotal: normalizeNumber(source.pcsCapacityTotal),
    pcsCapacityUsed: normalizeNumber(source.pcsCapacityUsed),
    pcsUtilizationPct: normalizeNumber(source.pcsUtilizationPct),
    cartonCapacityTotal: normalizeNumber(source.cartonCapacityTotal),
    cartonCapacityUsed: normalizeNumber(source.cartonCapacityUsed),
    cartonUtilizationPct: normalizeNumber(source.cartonUtilizationPct)
  };
}

function mapWarehouseLocationAlertRecord(data: any): WarehouseLocationAlertRecord {
  const source = data ?? {};

  return {
    id: normalizeText(source.id),
    severity: normalizeAlertSeverity(source.severity),
    utilizationPct: normalizeNumber(source.utilizationPct),
    siteCode: normalizeText(source.siteCode),
    siteName: normalizeText(source.siteName),
    siteType: normalizeSiteType(source.siteType),
    warehouseCode: normalizeText(source.warehouseCode),
    warehouseName: normalizeText(source.warehouseName),
    locationCode: normalizeText(source.locationCode),
    zone: normalizeText(source.zone),
    aisle: normalizeText(source.aisle),
    levelCode: normalizeText(source.levelCode),
    bin: normalizeText(source.bin),
    locationType: normalizeType(source.locationType),
    capacityUom: normalizeCapacityUom(source.capacityUom),
    capacityTotal: normalizeNumber(source.capacityTotal),
    capacityUsed: normalizeNumber(source.capacityUsed),
    remainingCapacity: normalizeNumber(source.remainingCapacity),
    status: normalizeStatus(source.status),
    isActive: normalizeBoolean(source.isActive),
    updatedAt: normalizeText(source.updatedAt)
  };
}

export function mapWarehouseLocation(data: any): WarehouseLocationRecord {
  const source = extractPayload<any>(data) ?? {};

  return {
    id: normalizeText(source.id),
    warehouseCode: normalizeText(source.warehouseCode),
    warehouseName: normalizeText(source.warehouseName),
    locationCode: normalizeText(source.locationCode),
    zone: normalizeText(source.zone),
    aisle: normalizeText(source.aisle),
    levelCode: normalizeText(source.levelCode),
    bin: normalizeText(source.bin),
    locationType: normalizeType(source.locationType),
    status: normalizeStatus(source.status),
    capacityUom: normalizeCapacityUom(source.capacityUom),
    palletCapacity: normalizeNumber(source.palletCapacity),
    usedPalletCapacity: normalizeNumber(source.usedPalletCapacity),
    cubicCapacityM3: normalizeNumber(source.cubicCapacityM3),
    usedCubicCapacityM3: normalizeNumber(source.usedCubicCapacityM3),
    isActive: normalizeBoolean(source.isActive),
    notes: normalizeText(source.notes),
    updatedAt: normalizeText(source.updatedAt)
  };
}

export function mapWarehouseLocationListResponse(data: any): WarehouseLocationListResponse {
  const source = extractPayload<any>(data) ?? {};
  const rawItems = Array.isArray(source.items) ? source.items : [];
  const items = rawItems.map(mapWarehouseLocation);
  const total = Number.isFinite(Number(source.total)) ? Number(source.total) : items.length;

  return {
    items,
    total
  };
}

export function mapWarehouseUtilizationSummary(data: any): WarehouseUtilizationSummary {
  const source = extractPayload<any>(data) ?? {};

  return {
    siteScope: normalizeSiteScope(source.siteScope),
    warehouseCode: normalizeNullableText(source.warehouseCode),
    totalLocations: normalizeNumber(source.totalLocations),
    activeLocations: normalizeNumber(source.activeLocations),
    inactiveLocations: normalizeNumber(source.inactiveLocations),
    emptyLocations: normalizeNumber(source.emptyLocations),
    occupiedLocations: normalizeNumber(source.occupiedLocations),
    blockedLocations: normalizeNumber(source.blockedLocations),
    fullLocations: normalizeNumber(source.fullLocations),
    fullLocationPct: normalizeNumber(source.fullLocationPct),
    palletCapacityTotal: normalizeNumber(source.palletCapacityTotal),
    palletCapacityUsed: normalizeNumber(source.palletCapacityUsed),
    palletUtilizationPct: normalizeNumber(source.palletUtilizationPct),
    pcsCapacityTotal: normalizeNumber(source.pcsCapacityTotal),
    pcsCapacityUsed: normalizeNumber(source.pcsCapacityUsed),
    pcsUtilizationPct: normalizeNumber(source.pcsUtilizationPct),
    cartonCapacityTotal: normalizeNumber(source.cartonCapacityTotal),
    cartonCapacityUsed: normalizeNumber(source.cartonCapacityUsed),
    cartonUtilizationPct: normalizeNumber(source.cartonUtilizationPct),
    updatedAt: normalizeText(source.updatedAt)
  };
}

export function mapWarehouseUtilizationDrilldown(data: any): WarehouseUtilizationDrilldown {
  const source = extractPayload<any>(data) ?? {};
  const rawByLocationType = Array.isArray(source.byLocationType) ? source.byLocationType : [];
  const rawByZone = Array.isArray(source.byZone) ? source.byZone : [];

  return {
    siteScope: normalizeSiteScope(source.siteScope),
    warehouseCode: normalizeNullableText(source.warehouseCode),
    byLocationType: rawByLocationType.map(mapWarehouseUtilizationDrilldownBucket),
    byZone: rawByZone.map(mapWarehouseUtilizationDrilldownBucket),
    updatedAt: normalizeText(source.updatedAt)
  };
}

export function mapWarehouseLocationAlertSummary(data: any): WarehouseLocationAlertSummary {
  const source = extractPayload<any>(data) ?? {};
  const rawItems = Array.isArray(source.items) ? source.items : [];

  return {
    siteScope: normalizeSiteScope(source.siteScope),
    warehouseCode: normalizeNullableText(source.warehouseCode),
    thresholdPct: normalizeNumber(source.thresholdPct),
    totalAlertLocations: normalizeNumber(source.totalAlertLocations),
    nearFullLocations: normalizeNumber(source.nearFullLocations),
    fullLocations: normalizeNumber(source.fullLocations),
    items: rawItems.map(mapWarehouseLocationAlertRecord),
    updatedAt: normalizeText(source.updatedAt)
  };
}
