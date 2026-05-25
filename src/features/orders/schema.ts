import type {
  CreateGRNRequest,
  CreatePurchaseOrderRequest,
  GRNFormErrors,
  GRNFormValues,
  PurchaseOrderFormErrors,
  PurchaseOrderFormLineValues,
  PurchaseOrderFormValues
} from './types';

export const initialPurchaseOrderLineValues: PurchaseOrderFormLineValues = {
  inventoryItemId: '',
  orderedQty: '1',
  unitCost: '0',
  notes: ''
};

export const initialPurchaseOrderFormValues: PurchaseOrderFormValues = {
  supplierName: '',
  quotationNo: '',
  currency: 'USD',
  expectedDate: '',
  status: 'draft',
  lines: [{ ...initialPurchaseOrderLineValues }]
};

export const initialGRNFormValues: GRNFormValues = {
  poNo: '',
  inventoryItemId: '',
  supplierName: '',
  batchNumber: '',
  lotNumber: '',
  supplierLotNumber: '',
  manufactureDate: '',
  expiryDate: '',
  receivedDate: '',
  receivedLines: '1',
  receivedQty: '0',
  status: 'draft',
  warehouseLocation: '',
  zone: '',
  aisle: '',
  levelCode: '',
  bin: ''
};

function isValidNonNegativeNumber(value: string) {
  const parsed = Number(value);
  return !Number.isNaN(parsed) && parsed >= 0;
}

export function calculatePurchaseOrderTotals(values: PurchaseOrderFormValues) {
  const validLines = values.lines.filter((line) => line.inventoryItemId.trim());
  const itemCount = validLines.length;

  const totalAmount = validLines.reduce((sum, line) => {
    const qty = Number(line.orderedQty);
    const unitCost = Number(line.unitCost);

    if (Number.isNaN(qty) || Number.isNaN(unitCost)) {
      return sum;
    }

    return sum + qty * unitCost;
  }, 0);

  return {
    itemCount,
    totalAmount: Number(totalAmount.toFixed(2))
  };
}

export function validatePurchaseOrderForm(values: PurchaseOrderFormValues): {
  isValid: boolean;
  errors: PurchaseOrderFormErrors;
} {
  const errors: PurchaseOrderFormErrors = {};
  const lineErrors: Array<Partial<Record<keyof PurchaseOrderFormLineValues, string>>> = [];

  if (!values.supplierName.trim()) {
    errors.supplierName = 'Supplier name is required';
  }

  if (!values.currency.trim()) {
    errors.currency = 'Currency is required';
  }

  if (!values.expectedDate.trim()) {
    errors.expectedDate = 'Expected date is required';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  if (!values.lines.length) {
    errors.lines = 'At least one purchase order line is required';
  }

  values.lines.forEach((line, index) => {
    const current: Partial<Record<keyof PurchaseOrderFormLineValues, string>> = {};

    if (!line.inventoryItemId.trim()) {
      current.inventoryItemId = 'Inventory item is required';
    }

    const qty = Number(line.orderedQty);
    if (Number.isNaN(qty) || qty <= 0) {
      current.orderedQty = 'Ordered qty must be greater than 0';
    }

    const unitCost = Number(line.unitCost);
    if (Number.isNaN(unitCost) || unitCost < 0) {
      current.unitCost = 'Unit cost must be 0 or greater';
    }

    lineErrors[index] = current;
  });

  if (lineErrors.some((item) => Object.keys(item).length > 0)) {
    errors.lineErrors = lineErrors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapPurchaseOrderFormToCreateRequest(
  values: PurchaseOrderFormValues,
  inventoryItems: Array<{
    id: string;
    sku: string;
    name: string;
  }>
): CreatePurchaseOrderRequest {
  const mappedLines = values.lines
    .filter((line) => line.inventoryItemId.trim())
    .map((line) => {
      const item = inventoryItems.find((row) => row.id === line.inventoryItemId);

      const orderedQty = Number(line.orderedQty);
      const unitCost = Number(line.unitCost);

      return {
        inventoryItemId: line.inventoryItemId,
        itemCode: item?.sku || '',
        itemName: item?.name || '',
        orderedQty,
        unitCost,
        currency: values.currency.trim().toUpperCase(),
        lineTotal: Number((orderedQty * unitCost).toFixed(2)),
        notes: line.notes.trim()
      };
    });

  const totals = calculatePurchaseOrderTotals(values);

  return {
    supplierName: values.supplierName.trim(),
    quotationNo: values.quotationNo.trim() || undefined,
    itemCount: totals.itemCount,
    totalAmount: totals.totalAmount,
    currency: values.currency.trim().toUpperCase(),
    expectedDate: values.expectedDate.trim(),
    status: values.status,
    lines: mappedLines
  };
}

export function validateGRNForm(values: GRNFormValues): {
  isValid: boolean;
  errors: GRNFormErrors;
} {
  const errors: GRNFormErrors = {};

  if (!values.poNo.trim()) {
    errors.poNo = 'PO number is required';
  }

  if (!values.inventoryItemId.trim()) {
    errors.inventoryItemId = 'Inventory item is required';
  }

  if (!values.supplierName.trim()) {
    errors.supplierName = 'Supplier name is required';
  }

  if (!values.batchNumber.trim()) {
    errors.batchNumber = 'Batch number is required';
  }

  if (!isValidNonNegativeNumber(values.receivedLines)) {
    errors.receivedLines = 'Received lines must be 0 or greater';
  }

  if (!isValidNonNegativeNumber(values.receivedQty)) {
    errors.receivedQty = 'Received quantity must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapGRNFormToRequest(values: GRNFormValues): CreateGRNRequest {
  return {
    poNo: values.poNo.trim(),
    inventoryItemId: values.inventoryItemId.trim(),
    supplierName: values.supplierName.trim(),
    batchNumber: values.batchNumber.trim(),
    lotNumber: values.lotNumber.trim(),
    supplierLotNumber: values.supplierLotNumber.trim(),
    manufactureDate: values.manufactureDate.trim() || null,
    expiryDate: values.expiryDate.trim() || null,
    receivedDate: values.receivedDate.trim() || null,
    receivedLines: Number(values.receivedLines),
    receivedQty: Number(values.receivedQty),
    status: values.status,
    warehouseLocation: values.warehouseLocation.trim(),
    zone: values.zone.trim(),
    aisle: values.aisle.trim(),
    levelCode: values.levelCode.trim(),
    bin: values.bin.trim()
  };
}