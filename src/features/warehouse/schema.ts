import { mapWarehouseLocationFormToRequest } from './mapper';
import type {
  CreateWarehouseLocationRequest,
  WarehouseLocationFormErrors,
  WarehouseLocationFormValues
} from './types';

export const initialWarehouseLocationFormValues: WarehouseLocationFormValues = {
  warehouseCode: '',
  warehouseName: '',
  locationCode: '',
  zone: '',
  aisle: '',
  levelCode: '',
  bin: '',
  locationType: 'rack',
  status: 'empty',
  palletCapacity: '0',
  usedPalletCapacity: '0',
  cubicCapacityM3: '0',
  usedCubicCapacityM3: '0',
  isActive: true,
  notes: ''
};

function validateRequiredText(
  value: string,
  field: keyof WarehouseLocationFormValues,
  errors: WarehouseLocationFormErrors,
  label: string,
  min = 1,
  max = 120
) {
  const text = value.trim();

  if (!text) {
    errors[field] = `${label} is required`;
    return;
  }

  if (text.length < min || text.length > max) {
    errors[field] = `${label} must be between ${min} and ${max} characters`;
  }
}

function validateNumberText(
  value: string,
  field: keyof WarehouseLocationFormValues,
  errors: WarehouseLocationFormErrors,
  label: string,
  min = 0
) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < min) {
    errors[field] = `${label} must be a valid number ${min} or greater`;
  }
}

export function validateWarehouseLocationForm(values: WarehouseLocationFormValues) {
  const errors: WarehouseLocationFormErrors = {};

  validateRequiredText(values.warehouseCode, 'warehouseCode', errors, 'Warehouse code', 2, 30);
  validateRequiredText(values.warehouseName, 'warehouseName', errors, 'Warehouse name', 2, 120);
  validateRequiredText(values.locationCode, 'locationCode', errors, 'Location code', 3, 50);
  validateRequiredText(values.zone, 'zone', errors, 'Zone', 1, 20);
  validateRequiredText(values.aisle, 'aisle', errors, 'Aisle', 1, 20);
  validateRequiredText(values.levelCode, 'levelCode', errors, 'Level', 1, 20);
  validateRequiredText(values.bin, 'bin', errors, 'Bin', 1, 20);

  validateNumberText(values.palletCapacity, 'palletCapacity', errors, 'Pallet capacity', 0);
  validateNumberText(values.usedPalletCapacity, 'usedPalletCapacity', errors, 'Used pallet capacity', 0);
  validateNumberText(values.cubicCapacityM3, 'cubicCapacityM3', errors, 'Cubic capacity', 0);
  validateNumberText(values.usedCubicCapacityM3, 'usedCubicCapacityM3', errors, 'Used cubic capacity', 0);

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapWarehouseLocationFormToCreateRequest(
  values: WarehouseLocationFormValues
): CreateWarehouseLocationRequest {
  return mapWarehouseLocationFormToRequest(values);
}