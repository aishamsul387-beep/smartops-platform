import type { CreateInventoryRequest, InventoryStatus } from './types';

export interface InventoryFormValues {
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  quantity: string;
  reorderLevel: string;
  minimumStockLevel: string;
  maximumStockLevel: string;
  unit: string;
  warehouseLocation: string;
  status: InventoryStatus;
  isActive: boolean;
  isBatchTracked: boolean;
  isExpiryTracked: boolean;
  isSerialTracked: boolean;
  baseUomCode: string;
  purchaseUomCode: string;
  salesUomCode: string;
  issueUomCode: string;
  uomConversionGroupCode: string;
  allowsFraction: boolean;
  notes: string;
}

export interface InventoryFormErrors {
  sku?: string;
  barcode?: string;
  name?: string;
  description?: string;
  category?: string;
  quantity?: string;
  reorderLevel?: string;
  minimumStockLevel?: string;
  maximumStockLevel?: string;
  unit?: string;
  warehouseLocation?: string;
  status?: string;
  baseUomCode?: string;
  purchaseUomCode?: string;
  salesUomCode?: string;
  issueUomCode?: string;
}

export const initialInventoryFormValues: InventoryFormValues = {
  sku: '',
  barcode: '',
  name: '',
  description: '',
  category: '',
  quantity: '',
  reorderLevel: '',
  minimumStockLevel: '',
  maximumStockLevel: '',
  unit: '',
  warehouseLocation: '',
  status: 'in_stock',
  isActive: true,
  isBatchTracked: false,
  isExpiryTracked: false,
  isSerialTracked: false,
  baseUomCode: '',
  purchaseUomCode: '',
  salesUomCode: '',
  issueUomCode: '',
  uomConversionGroupCode: '',
  allowsFraction: false,
  notes: ''
};

function isValidNonNegativeNumber(value: string) {
  const parsed = Number(value);
  return !Number.isNaN(parsed) && parsed >= 0;
}

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
  } else if (!isValidNonNegativeNumber(values.quantity)) {
    errors.quantity = 'Quantity must be a valid number 0 or greater';
  }

  if (!values.reorderLevel.trim()) {
    errors.reorderLevel = 'Reorder level is required';
  } else if (!isValidNonNegativeNumber(values.reorderLevel)) {
    errors.reorderLevel = 'Reorder level must be a valid number 0 or greater';
  }

  if (!values.minimumStockLevel.trim()) {
    errors.minimumStockLevel = 'Minimum stock level is required';
  } else if (!isValidNonNegativeNumber(values.minimumStockLevel)) {
    errors.minimumStockLevel = 'Minimum stock level must be a valid number 0 or greater';
  }

  if (!values.maximumStockLevel.trim()) {
    errors.maximumStockLevel = 'Maximum stock level is required';
  } else if (!isValidNonNegativeNumber(values.maximumStockLevel)) {
    errors.maximumStockLevel = 'Maximum stock level must be a valid number 0 or greater';
  }

  if (!values.unit.trim()) {
    errors.unit = 'Display unit is required';
  }

  if (!values.warehouseLocation.trim()) {
    errors.warehouseLocation = 'Warehouse location is required';
  }

  if (!values.baseUomCode.trim()) {
    errors.baseUomCode = 'Base UOM is required';
  }

  if (!values.purchaseUomCode.trim()) {
    errors.purchaseUomCode = 'Purchase UOM is required';
  }

  if (!values.salesUomCode.trim()) {
    errors.salesUomCode = 'Sales UOM is required';
  }

  if (!values.issueUomCode.trim()) {
    errors.issueUomCode = 'Issue UOM is required';
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
    barcode: values.barcode.trim(),
    name: values.name.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
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