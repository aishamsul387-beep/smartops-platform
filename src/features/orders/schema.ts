import type {
  CreateGRNRequest,
  CreatePurchaseOrderRequest,
  GRNFormErrors,
  GRNFormValues,
  PurchaseOrderFormErrors,
  PurchaseOrderFormValues
} from './types';

export const initialPurchaseOrderFormValues: PurchaseOrderFormValues = {
  supplierName: '',
  quotationNo: '',
  itemCount: '',
  totalAmount: '',
  currency: 'USD',
  expectedDate: '',
  status: 'draft'
};

export const initialGRNFormValues: GRNFormValues = {
  poNo: '',
  supplierName: '',
  receivedLines: '',
  receivedQty: '',
  status: 'draft'
};

export function validatePurchaseOrderForm(values: PurchaseOrderFormValues) {
  const errors: PurchaseOrderFormErrors = {};

  if (!values.supplierName.trim()) {
    errors.supplierName = 'Supplier name is required';
  }

  if (!values.itemCount.trim()) {
    errors.itemCount = 'Item count is required';
  } else if (Number.isNaN(Number(values.itemCount)) || Number(values.itemCount) <= 0) {
    errors.itemCount = 'Item count must be greater than 0';
  }

  if (!values.totalAmount.trim()) {
    errors.totalAmount = 'Total amount is required';
  } else if (Number.isNaN(Number(values.totalAmount)) || Number(values.totalAmount) < 0) {
    errors.totalAmount = 'Total amount must be a valid number 0 or greater';
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

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapPurchaseOrderFormToRequest(
  values: PurchaseOrderFormValues
): CreatePurchaseOrderRequest {
  return {
    supplierName: values.supplierName.trim(),
    quotationNo: values.quotationNo.trim() || undefined,
    itemCount: Number(values.itemCount),
    totalAmount: Number(values.totalAmount),
    currency: values.currency.trim(),
    expectedDate: values.expectedDate,
    status: values.status
  };
}

export function validateGRNForm(values: GRNFormValues) {
  const errors: GRNFormErrors = {};

  if (!values.poNo.trim()) {
    errors.poNo = 'PO number is required';
  }

  if (!values.supplierName.trim()) {
    errors.supplierName = 'Supplier name is required';
  }

  if (!values.receivedLines.trim()) {
    errors.receivedLines = 'Received lines is required';
  } else if (Number.isNaN(Number(values.receivedLines)) || Number(values.receivedLines) < 0) {
    errors.receivedLines = 'Received lines must be a valid number 0 or greater';
  }

  if (!values.receivedQty.trim()) {
    errors.receivedQty = 'Received quantity is required';
  } else if (Number.isNaN(Number(values.receivedQty)) || Number(values.receivedQty) < 0) {
    errors.receivedQty = 'Received quantity must be a valid number 0 or greater';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function mapGRNFormToRequest(values: GRNFormValues): CreateGRNRequest {
  return {
    poNo: values.poNo.trim(),
    supplierName: values.supplierName.trim(),
    receivedLines: Number(values.receivedLines),
    receivedQty: Number(values.receivedQty),
    status: values.status
  };
}