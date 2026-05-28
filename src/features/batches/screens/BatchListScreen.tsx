'use client';

import Link from 'next/link';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { batchesApi } from '../api';
import { useBatchList } from '../hooks/useBatchList';
import {
  initialBatchFormValues,
  type BatchFormErrors,
  type BatchFormValues,
  type BatchStatus
} from '../types';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';

function getBatchStatusStyle(status: string) {
  if (status === 'available') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'quarantine') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  if (status === 'blocked') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  if (status === 'expired') {
    return {
      background: '#e0e7ff',
      color: '#3730a3',
      border: '1px solid #c7d2fe'
    };
  }

  return {
    background: '#e2e8f0',
    color: '#334155',
    border: '1px solid #cbd5e1'
  };
}

function validateBatchForm(values: BatchFormValues, selectedInventoryItem?: InventoryItem | null) {
  const errors: BatchFormErrors = {};

  if (!values.inventoryItemId.trim()) {
    errors.inventoryItemId = 'Inventory item is required';
  }

  if (!values.batchNumber.trim()) {
    errors.batchNumber = 'Batch number is required';
  }

  const unitCost = Number(values.unitCost);
  if (Number.isNaN(unitCost) || unitCost < 0) {
    errors.unitCost = 'Unit cost must be a valid number 0 or greater';
  }

  const receivedQty = Number(values.receivedQty);
  if (Number.isNaN(receivedQty) || receivedQty < 0) {
    errors.receivedQty = 'Received quantity must be a valid number 0 or greater';
  }

  const availableQty = Number(values.availableQty);
  if (Number.isNaN(availableQty) || availableQty < 0) {
    errors.availableQty = 'Available quantity must be a valid number 0 or greater';
  }

  if (selectedInventoryItem?.isExpiryTracked && !values.expiryDate.trim()) {
    errors.batchNumber =
      errors.batchNumber || 'This item requires expiry tracking, so expiry date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function BatchListScreen() {
  const {
    items,
    total,
    filters,
    persistenceMode,
    isLoading,
    error,
    updateSearch,
    updateStatus,
    updateInventoryItemId,
    refresh
  } = useBatchList();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [formValues, setFormValues] = useState<BatchFormValues>(initialBatchFormValues);
  const [formErrors, setFormErrors] = useState<BatchFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadInventoryItems() {
      try {
        setIsInventoryLoading(true);
        const result = await inventoryApi.getInventoryList({ search: '', status: 'all' });
        setInventoryItems(result.items);
      } catch {
        setInventoryItems([]);
      } finally {
        setIsInventoryLoading(false);
      }
    }

    void loadInventoryItems();
  }, []);

  const inventorySummaryById = useMemo(() => {
    return inventoryItems.reduce<Record<string, InventoryItem>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [inventoryItems]);

  const selectedInventoryItem = useMemo(
    () => inventoryItems.find((item) => item.id === formValues.inventoryItemId) || null,
    [inventoryItems, formValues.inventoryItemId]
  );

  const isBatchCreationBlocked =
    !!selectedInventoryItem && !selectedInventoryItem.isBatchTracked;

  function updateField<K extends keyof BatchFormValues>(field: K, value: BatchFormValues[K]) {
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));

    setFormErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateBatchForm(formValues, selectedInventoryItem);
    setFormErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    if (selectedInventoryItem && !selectedInventoryItem.isBatchTracked) {
      setFormError('Selected inventory item is not batch-tracked, so batch creation is not allowed.');
      return;
    }

    if (selectedInventoryItem?.isExpiryTracked && !formValues.expiryDate.trim()) {
      setFormError('Selected inventory item requires expiry tracking, so expiry date is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      await batchesApi.createBatch({
        inventoryItemId: formValues.inventoryItemId.trim(),
        batchNumber: formValues.batchNumber.trim(),
        lotNumber: formValues.lotNumber.trim(),
        supplierLotNumber: formValues.supplierLotNumber.trim(),
        manufactureDate: formValues.manufactureDate.trim() || null,
        expiryDate: formValues.expiryDate.trim() || null,
        receivedDate: formValues.receivedDate.trim() || null,
        supplierName: formValues.supplierName.trim(),
        purchaseOrderNo: formValues.purchaseOrderNo.trim(),
        goodsReceivedNoteNo: formValues.goodsReceivedNoteNo.trim(),
        unitCost: Number(formValues.unitCost),
        currency: formValues.currency.trim() || 'USD',
        receivedQty: Number(formValues.receivedQty),
        availableQty: Number(formValues.availableQty),
        reservedQty: 0,
        blockedQty: 0,
        qaHoldQty: 0,
        batchStatus: formValues.batchStatus,
        warehouseLocation: formValues.warehouseLocation.trim(),
        zone: formValues.zone.trim(),
        aisle: formValues.aisle.trim(),
        levelCode: formValues.levelCode.trim(),
        bin: formValues.bin.trim(),
        notes: formValues.notes.trim()
      });

      setFormValues(initialBatchFormValues);
      setFormErrors({});
      await refresh();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              Batch / Expiry Control
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Batch traceability layer for expiry, lot, supplier lot, GRN/PO linkage, and quantity control.
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
          Create Batch
        </div>

        {selectedInventoryItem ? (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: isBatchCreationBlocked ? '#fef2f2' : '#f8fafc',
              color: isBatchCreationBlocked ? '#b91c1c' : '#475569',
              border: isBatchCreationBlocked ? '1px solid #fecaca' : '1px solid #e2e8f0'
            }}
          >
            <strong>{selectedInventoryItem.name}</strong><br />
            SKU: <strong>{selectedInventoryItem.sku}</strong><br />
            Barcode: <strong>{selectedInventoryItem.barcode || '-'}</strong><br />
            Batch tracked: <strong>{selectedInventoryItem.isBatchTracked ? 'Yes' : 'No'}</strong><br />
            Expiry tracked: <strong>{selectedInventoryItem.isExpiryTracked ? 'Yes' : 'No'}</strong><br />
            Serial tracked: <strong>{selectedInventoryItem.isSerialTracked ? 'Yes' : 'No'}</strong><br />
            {isBatchCreationBlocked
              ? 'This item is not batch-tracked. Batch creation is blocked by policy.'
              : 'This item can be used for batch creation.'}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label htmlFor="inventoryItemId" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Product Name
              </label>
              <select
                id="inventoryItemId"
                value={formValues.inventoryItemId}
                onChange={(event) => updateField('inventoryItemId', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
              >
                <option value="">
                  {isInventoryLoading ? 'Loading inventory...' : 'Select product name'}
                </option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formErrors.inventoryItemId ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{formErrors.inventoryItemId}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                SKU
              </label>
              <div
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff'
                }}
              >
                {selectedInventoryItem?.sku || '-'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Barcode
              </label>
              <div
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff'
                }}
              >
                {selectedInventoryItem?.barcode || '-'}
              </div>
            </div>

            <div>
              <label htmlFor="batchNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Batch Number
              </label>
              <input
                id="batchNumber"
                value={formValues.batchNumber}
                onChange={(event) => updateField('batchNumber', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {formErrors.batchNumber ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{formErrors.batchNumber}</div> : null}
            </div>

            <div>
              <label htmlFor="lotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Lot Number
              </label>
              <input
                id="lotNumber"
                value={formValues.lotNumber}
                onChange={(event) => updateField('lotNumber', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="supplierLotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Supplier Lot Number
              </label>
              <input
                id="supplierLotNumber"
                value={formValues.supplierLotNumber}
                onChange={(event) => updateField('supplierLotNumber', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="manufactureDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Manufacture Date
              </label>
              <input
                id="manufactureDate"
                type="date"
                value={formValues.manufactureDate}
                onChange={(event) => updateField('manufactureDate', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="date"
                value={formValues.expiryDate}
                onChange={(event) => updateField('expiryDate', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="receivedDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Received Date
              </label>
              <input
                id="receivedDate"
                type="date"
                value={formValues.receivedDate}
                onChange={(event) => updateField('receivedDate', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="supplierName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Supplier Name
              </label>
              <input
                id="supplierName"
                value={formValues.supplierName}
                onChange={(event) => updateField('supplierName', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="purchaseOrderNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Purchase Order No
              </label>
              <input
                id="purchaseOrderNo"
                value={formValues.purchaseOrderNo}
                onChange={(event) => updateField('purchaseOrderNo', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="goodsReceivedNoteNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                GRN No
              </label>
              <input
                id="goodsReceivedNoteNo"
                value={formValues.goodsReceivedNoteNo}
                onChange={(event) => updateField('goodsReceivedNoteNo', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="unitCost" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Unit Cost
              </label>
              <input
                id="unitCost"
                value={formValues.unitCost}
                onChange={(event) => updateField('unitCost', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {formErrors.unitCost ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{formErrors.unitCost}</div> : null}
            </div>

            <div>
              <label htmlFor="currency" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Currency
              </label>
              <input
                id="currency"
                value={formValues.currency}
                onChange={(event) => updateField('currency', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="receivedQty" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Received Qty
              </label>
              <input
                id="receivedQty"
                value={formValues.receivedQty}
                onChange={(event) => updateField('receivedQty', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {formErrors.receivedQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{formErrors.receivedQty}</div> : null}
            </div>

            <div>
              <label htmlFor="availableQty" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Available Qty
              </label>
              <input
                id="availableQty"
                value={formValues.availableQty}
                onChange={(event) => updateField('availableQty', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
              {formErrors.availableQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{formErrors.availableQty}</div> : null}
            </div>

            <div>
              <label htmlFor="batchStatus" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Batch Status
              </label>
              <select
                id="batchStatus"
                value={formValues.batchStatus}
                onChange={(event) =>
                  updateField('batchStatus', event.target.value as BatchStatus)
                }
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
              >
                <option value="available">available</option>
                <option value="blocked">blocked</option>
                <option value="quarantine">quarantine</option>
                <option value="expired">expired</option>
                <option value="consumed">consumed</option>
              </select>
            </div>

            <div>
              <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Warehouse Location
              </label>
              <input
                id="warehouseLocation"
                value={formValues.warehouseLocation}
                onChange={(event) => updateField('warehouseLocation', event.target.value)}
                placeholder="A-01-01"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="zone" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zone</label>
              <input
                id="zone"
                value={formValues.zone}
                onChange={(event) => updateField('zone', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="aisle" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Aisle</label>
              <input
                id="aisle"
                value={formValues.aisle}
                onChange={(event) => updateField('aisle', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="levelCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Level</label>
              <input
                id="levelCode"
                value={formValues.levelCode}
                onChange={(event) => updateField('levelCode', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label htmlFor="bin" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bin</label>
              <input
                id="bin"
                value={formValues.bin}
                onChange={(event) => updateField('bin', event.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="notes" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Notes
              </label>
              <textarea
                id="notes"
                value={formValues.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>
          </div>

          {formError ? (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {formError}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting || isBatchCreationBlocked}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isSubmitting || isBatchCreationBlocked ? '#94a3b8' : '#7c3aed',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Batch'}
            </button>

            <button
              type="button"
              onClick={() => setFormValues(initialBatchFormValues)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Batches</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{total}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Persistence Mode</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{persistenceMode || '-'}</div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label htmlFor="batch-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="batch-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search SKU, barcode, product, batch, lot, supplier"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="batch-inventory" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Product Name
            </label>
            <select
              id="batch-inventory"
              value={filters.inventoryItemId || ''}
              onChange={(event) => updateInventoryItemId(event.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="">All products</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="batch-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Batch Status
            </label>
            <select
              id="batch-status"
              value={filters.status || 'all'}
              onChange={(event) =>
                updateStatus(
                  event.target.value as 'all' | 'available' | 'blocked' | 'quarantine' | 'expired' | 'consumed'
                )
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="blocked">Blocked</option>
              <option value="quarantine">Quarantine</option>
              <option value="expired">Expired</option>
              <option value="consumed">Consumed</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading batches...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No batches found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Barcode</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Product Name</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Batch</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Lot</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier Lot</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PO / GRN</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qtys</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Expiry</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const inventory = inventorySummaryById[item.inventoryItemId];

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        {inventory?.sku || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {inventory?.barcode || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {inventory?.name || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        <Link href={`/batches/${item.id}`} style={{ color: '#2563eb' }}>
                          {item.batchNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.lotNumber || '-'}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierLotNumber || '-'}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierName || '-'}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {item.purchaseOrderNo || '-'} / {item.goodsReceivedNoteNo || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        Rec {item.receivedQty} / Avl {item.availableQty} / Res {item.reservedQty}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {item.expiryDate || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '6px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            ...getBatchStatusStyle(item.batchStatus)
                          }}
                        >
                          {item.batchStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {item.zone}-{item.aisle}-{item.levelCode}-{item.bin}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}