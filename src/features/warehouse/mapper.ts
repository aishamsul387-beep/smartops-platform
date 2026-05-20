import type {
  WarehouseLocation,
  WarehouseLocationDto,
  WarehouseLocationStatus
} from './types';

const STATUS_LABELS: Record<WarehouseLocationStatus, string> = {
  available: 'Available',
  limited: 'Limited',
  full: 'Full'
};

export function mapWarehouseLocation(dto: WarehouseLocationDto): WarehouseLocation {
  const utilizationPercent =
    dto.capacity > 0 ? Math.round((dto.occupied / dto.capacity) * 100) : 0;

  return {
    id: dto.id,
    code: dto.code,
    zone: dto.zone,
    aisle: dto.aisle,
    bin: dto.bin,
    capacity: dto.capacity,
    occupied: dto.occupied,
    itemCount: dto.itemCount,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    utilizationPercent,
    updatedAt: dto.updatedAt
  };
}