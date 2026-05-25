import type {
  CreateInventoryRequest,
  InventoryFormValues,
  InventoryItem,
  InventoryItemType,
  InventoryListResponse,
  InventoryStatus
} from './types';

function asText(value: unknown, fallback = '') {
  return String(value ?? fallback);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function asBoolean(value: unknown) {
  return Boolean(value);
}

function getStatusLabel(status: InventoryStatus) {
  if (status === 'in_stock') {
    return 'In stock';
  }

  if (status === 'low_stock') {
    return 'Low stock';
  }

  return 'Out of stock';
}

export function mapInventoryItem(payload: any): InventoryItem {
  const status = asText(payload?.status || 'in_stock') as InventoryStatus;

  return {
    id: asText(payload?.id),
    sku: asText(payload?.sku),
    barcode: asText(payload?.barcode),
    name: asText(payload?.name),
    description: asText(payload?.description),
    category: asText(payload?.category),
    itemType: asText(payload?.itemType || 'raw_material') as InventoryItemType,
    brand: asText(payload?.brand),
    model: asText(payload?.model),
    preferredSupplierName: asText(payload?.preferredSupplierName),
    standardCost: asNumber(payload?.standardCost, 0),
    averageCost: asNumber(payload?.averageCost, 0),
    currency: asText(payload?.currency || 'USD'),
    quantity: asNumber(payload?.quantity, 0),
    reorderLevel: asNumber(payload?.reorderLevel, 0),
    minimumStockLevel: asNumber(payload?.minimumStockLevel, 0),
    maximumStockLevel: asNumber(payload?.maximumStockLevel, 0),
    unit: asText(payload?.unit),
    warehouseLocation: asText(payload?.warehouseLocation),
    status,
    statusLabel: getStatusLabel(status),
    isActive: asBoolean(payload?.isActive),
    isBatchTracked: asBoolean(payload?.isBatchTracked),
    isExpiryTracked: asBoolean(payload?.isExpiryTracked),
    isSerialTracked: asBoolean(payload?.isSerialTracked),
    baseUomCode: asText(payload?.baseUomCode),
    purchaseUomCode: asText(payload?.purchaseUomCode),
    salesUomCode: asText(payload?.salesUomCode),
    issueUomCode: asText(payload?.issueUomCode),
    uomConversionGroupCode: asText(payload?.uomConversionGroupCode),
    allowsFraction: asBoolean(payload?.allowsFraction),
    notes: asText(payload?.notes),
    updatedAt: asText(payload?.updatedAt)
  };
}

export function mapInventoryListResponse(payload: any): InventoryListResponse {
  return {
    items: Array.isArray(payload?.items) ? payload.items.map(mapInventoryItem) : [],
    total: asNumber(payload?.total, 0),
    persistenceMode: asText(payload?.persistenceMode || 'memory')
  };
}

export function mapInventoryToFormValues(item: InventoryItem): InventoryFormValues {
  return {
    sku: item.sku,
    barcode: item.barcode,
    name: item.name,
    description: item.description,
    category: item.category,
    itemType: item.itemType,
    brand: item.brand,
    model: item.model,
    preferredSupplierName: item.preferredSupplierName,
    standardCost: String(item.standardCost),
    averageCost: String(item.averageCost),
    currency: item.currency,
    quantity: String(item.quantity),
    reorderLevel: String(item.reorderLevel),
    minimumStockLevel: String(item.minimumStockLevel),
    maximumStockLevel: String(item.maximumStockLevel),
    unit: item.unit,
    warehouseLocation: item.warehouseLocation,
    status: item.status,
    isActive: item.isActive,
    isBatchTracked: item.isBatchTracked,
    isExpiryTracked: item.isExpiryTracked,
    isSerialTracked: item.isSerialTracked,
    baseUomCode: item.baseUomCode,
    purchaseUomCode: item.purchaseUomCode,
    salesUomCode: item.salesUomCode,
    issueUomCode: item.issueUomCode,
    uomConversionGroupCode: item.uomConversionGroupCode,
    allowsFraction: item.allowsFraction,
    notes: item.notes
  };
}

export function mapInventoryResponse(payload: any) {
  return mapInventoryItem(payload);
}

export function mapInventoryFormToRequest(values: InventoryFormValues): CreateInventoryRequest {
  const safeCurrency = String(values.currency ?? 'USD').trim().toUpperCase() || 'USD';

  return {
    sku: values.sku.trim(),
    barcode: values.barcode.trim(),
    name: values.name.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    itemType: (values.itemType ?? 'raw_material') as InventoryItemType,
    brand: String(values.brand ?? '').trim(),
    model: String(values.model ?? '').trim(),
    preferredSupplierName: String(values.preferredSupplierName ?? '').trim(),
    standardCost: Number(values.standardCost ?? '0'),
    averageCost: Number(values.averageCost ?? '0'),
    currency: safeCurrency,
    quantity: Number(values.quantity),
    reorderLevel: Number(values.reorderLevel),
    minimumStockLevel: Number(values.minimumStockLevel),
    maximumStockLevel: Number(values.maximumStockLevel),
    unit: values.unit.trim(),
    warehouseLocation: values.warehouseLocation.trim(),
    status: values.status,
    isActive: values.isActive,
    isBatchTracked: values.isBatchTracked,
    isExpiryTracked: values.isExpiryTracked,
    isSerialTracked: values.isSerialTracked,
    baseUomCode: values.baseUomCode.trim().toUpperCase(),
    purchaseUomCode: values.purchaseUomCode.trim().toUpperCase(),
    salesUomCode: values.salesUomCode.trim().toUpperCase(),
    issueUomCode: values.issueUomCode.trim().toUpperCase(),
    uomConversionGroupCode: values.uomConversionGroupCode.trim().toUpperCase(),
    allowsFraction: values.allowsFraction,
    notes: values.notes.trim()
  };
}