import type { InventoryItem, InventoryItemDto, InventoryStatus } from './types';

const STATUS_LABELS: Record<InventoryStatus, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock'
};

export function mapInventoryItem(dto: InventoryItemDto): InventoryItem {
  return {
    id: dto.id,
    sku: dto.sku,
    barcode: dto.barcode || '',
    name: dto.name,
    description: dto.description || '',
    category: dto.category,
    quantity: dto.quantity,
    reorderLevel: dto.reorderLevel,
    minimumStockLevel: dto.minimumStockLevel,
    maximumStockLevel: dto.maximumStockLevel,
    unit: dto.unit,
    warehouseLocation: dto.warehouseLocation,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    isActive: dto.isActive,
    isBatchTracked: dto.isBatchTracked,
    isExpiryTracked: dto.isExpiryTracked,
    isSerialTracked: dto.isSerialTracked,
    baseUomCode: dto.baseUomCode || '',
    purchaseUomCode: dto.purchaseUomCode || '',
    salesUomCode: dto.salesUomCode || '',
    issueUomCode: dto.issueUomCode || '',
    uomConversionGroupCode: dto.uomConversionGroupCode || '',
    allowsFraction: dto.allowsFraction,
    notes: dto.notes || '',
    updatedAt: dto.updatedAt
  };
}