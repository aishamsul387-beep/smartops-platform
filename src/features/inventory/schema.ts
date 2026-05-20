import type { CreateInventoryRequest, InventoryStatus } from './types';

export interface InventoryFormValues {
  sku: string;
  name: string;
  category: string;
  quantity: string;
  reorderLevel: string;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
}

export interface InventoryFormErrors {
  sku?: string;
  name?: string;
  category?: string;
  quantity?: string;
  reorderLevel?: string;
  unit?: string;
  warehouseLocation?: string;
  status?: string;
}

export const initialInventoryFormValues: InventoryFormValues = {
  sku: '',
  name: '',
  category: '',
  quantity: '',
  reorderLevel: '',
  unit: '',
  warehouseLocation: '',
  status: 'in_stock'
};

export function validateInventoryForm(values: InventoryFormValues) {
  const errors: InventoryFormErrors = {};

  if (!values.sku.trim()) {
    errors.sku = 'SKU is required';
  }

  if (!values.name.trim()) {
    errors.name = 'Item name is required';
  }

  if (!values.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!values.quantity.trim()) {
    errors.quantity = 'Quantity is required';
  } else if (Number.isNaN(Number(values.quantity)) || Number(values.quantity) < 0) {
    errors.quantity = 'Quantity must be a valid number 0 or greater';
  }

  if (!values.reorderLevel.trim()) {
    errors.reorderLevel = 'Reorder level is required';
  } else if (Number.isNaN(Number(values.reorderLevel)) || Number(values.reorderLevel) < 0) {
    errors.reorderLevel = 'Reorder level must be a valid number 0 or greater';
  }

  if (!values.unit.trim()) {
    errors.unit = 'Unit is required';
  }

  if (!values.warehouseLocation.trim()) {
    errors.warehouseLocation = 'Warehouse location is required';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapInventoryFormToCreateRequest(
  values: InventoryFormValues
): CreateInventoryRequest {
  return {
    sku: values.sku.trim(),
    name: values.name.trim(),
    category: values.category.trim(),
    quantity: Number(values.quantity),
    reorderLevel: Number(values.reorderLevel),
    unit: values.unit.trim(),
    warehouseLocation: values.warehouseLocation.trim(),
    status: values.status
  };
}