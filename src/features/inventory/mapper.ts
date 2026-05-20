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
    name: dto.name,
    category: dto.category,
    quantity: dto.quantity,
    reorderLevel: dto.reorderLevel,
    unit: dto.unit,
    warehouseLocation: dto.warehouseLocation,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    updatedAt: dto.updatedAt
  };
}