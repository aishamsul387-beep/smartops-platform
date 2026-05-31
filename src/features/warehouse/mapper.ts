import type {
  CreateWarehouseLocationRequest,
  WarehouseLocationFormValues,
  WarehouseLocationListResponse,
  WarehouseLocationRecord
} from './types';

function asText(value: unknown, fallback = '') {
  return String(value ?? fallback);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function mapWarehouseLocation(payload: any): WarehouseLocationRecord {
  return {
    id: asText(payload?.id),
    warehouseCode: asText(payload?.warehouseCode),
    warehouseName: asText(payload?.warehouseName),
    locationCode: asText(payload?.locationCode),
    zone: asText(payload?.zone),
    aisle: asText(payload?.aisle),
    levelCode: asText(payload?.levelCode),
    bin: asText(payload?.bin),
    locationType: asText(payload?.locationType) as WarehouseLocationRecord['locationType'],
    status: asText(payload?.status) as WarehouseLocationRecord['status'],
    palletCapacity: asNumber(payload?.palletCapacity),
    usedPalletCapacity: asNumber(payload?.usedPalletCapacity),
    cubicCapacityM3: asNumber(payload?.cubicCapacityM3),
    usedCubicCapacityM3: asNumber(payload?.usedCubicCapacityM3),
    isActive: Boolean(payload?.isActive),
    notes: asText(payload?.notes),
    updatedAt: asText(payload?.updatedAt)
  };
}

export function mapWarehouseLocationListResponse(payload: any): WarehouseLocationListResponse {
  return {
    items: Array.isArray(payload?.items) ? payload.items.map(mapWarehouseLocation) : [],
    total: asNumber(payload?.total)
  };
}

export function mapWarehouseLocationFormToRequest(
  values: WarehouseLocationFormValues
): CreateWarehouseLocationRequest {
  return {
    warehouseCode: values.warehouseCode.trim(),
    warehouseName: values.warehouseName.trim(),
    locationCode: values.locationCode.trim(),
    zone: values.zone.trim(),
    aisle: values.aisle.trim(),
    levelCode: values.levelCode.trim(),
    bin: values.bin.trim(),
    locationType: values.locationType,
    status: values.status,
    palletCapacity: Number(values.palletCapacity),
    usedPalletCapacity: Number(values.usedPalletCapacity),
    cubicCapacityM3: Number(values.cubicCapacityM3),
    usedCubicCapacityM3: Number(values.usedCubicCapacityM3),
    isActive: values.isActive,
    notes: values.notes.trim()
  };
}