'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createH11BIssue, previewH11BIssue } from '../api';
import { H11BPreviewResponse, H11BReasonCode } from '../types';

export interface H11BFormState {
  inventoryItemId: string;
  productName: string;
  sku: string;
  barcode: string;
  requestedQty: number;
  reasonCode: H11BReasonCode | '';
  warehouseCode: string;
  locationCode: string;
  remarks: string;
}

const defaultState: H11BFormState = {
  inventoryItemId: '',
  productName: '',
  sku: '',
  barcode: '',
  requestedQty: 1,
  reasonCode: '',
  warehouseCode: '',
  locationCode: '',
  remarks: '',
};

export function useStockIssueH11BForm() {
  const router = useRouter();
  const [form, setForm] = useState<H11BFormState>(defaultState);
  const [preview, setPreview] = useState<H11BPreviewResponse | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField<K extends keyof H11BFormState>(key: K, value: H11BFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.inventoryItemId.trim()) return 'Inventory Item ID is required';
    if (!form.productName.trim()) return 'Product Name is required';
    if (!form.requestedQty || form.requestedQty <= 0) return 'Requested Qty must be greater than 0';
    if (!form.reasonCode) return 'Reason Code is required';
    if (!form.warehouseCode.trim()) return 'Warehouse is required';
    if (!form.locationCode.trim()) return 'Location is required';
    return '';
  }

  async function doPreview() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoadingPreview(true);
      setError('');
      setSuccess('');
      const result = await previewH11BIssue({
        inventoryItemId: form.inventoryItemId,
        productName: form.productName,
        sku: form.sku || null,
        barcode: form.barcode || null,
        requestedQty: Number(form.requestedQty),
        reasonCode: form.reasonCode as H11BReasonCode,
        warehouseCode: form.warehouseCode,
        locationCode: form.locationCode,
        remarks: form.remarks || null,
      });
      setPreview(result);
    } catch (err: any) {
      setError(err?.message || 'Preview failed');
    } finally {
      setLoadingPreview(false);
    }
  }

  async function doSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const result = await createH11BIssue({
        inventoryItemId: form.inventoryItemId,
        productName: form.productName,
        sku: form.sku || null,
        barcode: form.barcode || null,
        requestedQty: Number(form.requestedQty),
        reasonCode: form.reasonCode as H11BReasonCode,
        warehouseCode: form.warehouseCode,
        locationCode: form.locationCode,
        remarks: form.remarks || null,
      });

      setSuccess(`Created ${result.issue.issueNumber}`);
      router.push(`/stock-issues-h11b/${result.issue.id}`);
    } catch (err: any) {
      setError(err?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(defaultState);
    setPreview(null);
    setError('');
    setSuccess('');
  }

  return {
    form,
    preview,
    loadingPreview,
    submitting,
    error,
    success,
    updateField,
    doPreview,
    doSubmit,
    resetForm,
  };
}
