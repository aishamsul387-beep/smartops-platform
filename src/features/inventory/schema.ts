import { mapInventoryFormToRequest } from './mapper';
import type {
  CreateInventoryRequest,
  InventoryFormErrors,
  InventoryFormValues,
  InventoryItemType
} from './types';

export type { InventoryFormErrors, InventoryFormValues };

export const initialInventoryFormValues: InventoryFormValues = {
  sku: '',
  barcode: '',
  name: '',
  description: '',
  category: '',
  itemType: 'raw_material',
  brand: '',
  model: '',
  preferredSupplierName: '',
  standardCost: '0',
  averageCost: '0',
  currency: 'USD',
  quantity: '0',
  reorderLevel: '0',
  minimumStockLevel: '0',
  maximumStockLevel: '0',
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

const allowedItemTypes: InventoryItemType[] = [
  'raw_material',
  'finished_goods',
  'packaging',
  'spare_part',
  'consumable'
];

function validateRequiredText(
  value: string,
  field: keyof InventoryFormValues,
  errors: InventoryFormErrors,
  label: string,
  min = 1,
  max = 150
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

function validateOptionalText(
  value: string,
  field: keyof InventoryFormValues,
  errors: InventoryFormErrors,
  label: string,
  max = 150
) {
  const text = value.trim();

  if (text && text.length > max) {
    errors[field] = `${label} must be ${max} characters or less`;
  }
}

function validateNumberText(
  value: string,
  field: keyof InventoryFormValues,
  errors: InventoryFormErrors,
  label: string,
  min = 0
) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < min) {
    errors[field] = `${label} must be a valid number ${min} or greater`;
  }
}

export function validateInventoryForm(values: InventoryFormValues) {
  const errors: InventoryFormErrors = {};

  validateRequiredText(values.sku, 'sku', errors, 'SKU', 2, 50);
  validateOptionalText(values.barcode, 'barcode', errors, 'Barcode', 60);
  validateRequiredText(values.name, 'name', errors, 'Name', 2, 120);
  validateRequiredText(values.category, 'category', errors, 'Category', 2, 80);
  validateOptionalText(values.description, 'description', errors, 'Description', 500);

  if (!values.itemType || !allowedItemTypes.includes(values.itemType)) {
    errors.itemType = 'Item type is required';
  }

  validateOptionalText(String(values.brand ?? ''), 'brand', errors, 'Brand', 80);
  validateOptionalText(String(values.model ?? ''), 'model', errors, 'Model', 80);
  validateOptionalText(
    String(values.preferredSupplierName ?? ''),
    'preferredSupplierName',
    errors,
    'Preferred supplier',
    120
  );

  validateNumberText(String(values.standardCost ?? '0'), 'standardCost', errors, 'Standard cost', 0);
  validateNumberText(String(values.averageCost ?? '0'), 'averageCost', errors, 'Average cost', 0);

  const currency = String(values.currency ?? 'USD').trim().toUpperCase();
  if (!currency) {
    errors.currency = 'Currency is required';
  } else if (currency.length < 3 || currency.length > 10) {
    errors.currency = 'Currency must be between 3 and 10 characters';
  }

  validateNumberText(values.quantity, 'quantity', errors, 'Quantity', 0);
  validateNumberText(values.reorderLevel, 'reorderLevel', errors, 'Reorder level', 0);
  validateNumberText(
    values.minimumStockLevel,
    'minimumStockLevel',
    errors,
    'Minimum stock level',
    0
  );
  validateNumberText(
    values.maximumStockLevel,
    'maximumStockLevel',
    errors,
    'Maximum stock level',
    0
  );

  const minimumStockLevel = Number(values.minimumStockLevel);
  const maximumStockLevel = Number(values.maximumStockLevel);

  if (
    !Number.isNaN(minimumStockLevel) &&
    !Number.isNaN(maximumStockLevel) &&
    maximumStockLevel > 0 &&
    maximumStockLevel < minimumStockLevel
  ) {
    errors.maximumStockLevel =
      'Maximum stock level must be greater than or equal to minimum stock level';
  }

  validateRequiredText(values.unit, 'unit', errors, 'Display unit', 1, 20);
  validateRequiredText(
    values.warehouseLocation,
    'warehouseLocation',
    errors,
    'Warehouse location',
    3,
    30
  );

  validateRequiredText(values.baseUomCode, 'baseUomCode', errors, 'Base UOM', 1, 20);
  validateRequiredText(values.purchaseUomCode, 'purchaseUomCode', errors, 'Purchase UOM', 1, 20);
  validateRequiredText(values.salesUomCode, 'salesUomCode', errors, 'Sales UOM', 1, 20);
  validateRequiredText(values.issueUomCode, 'issueUomCode', errors, 'Issue UOM', 1, 20);

  validateOptionalText(values.notes, 'notes', errors, 'Notes', 1000);

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapInventoryFormToCreateRequest(
  values: InventoryFormValues
): CreateInventoryRequest {
  return mapInventoryFormToRequest(values);
}