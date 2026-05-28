'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';
import { useCreatePurchaseOrder } from '../hooks/useCreatePurchaseOrder';
import {
  calculatePurchaseOrderTotals,
  initialPurchaseOrderFormValues,
  initialPurchaseOrderLineValues,
  mapPurchaseOrderFormToCreateRequest,
  validatePurchaseOrderForm
} from '../schema';
import type {
  PurchaseOrderFormErrors,
  PurchaseOrderFormLineValues,
  PurchaseOrderFormValues
} from '../types';

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 600
} as const;

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1'
} as const;

const selectStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  background: '#ffffff'
} as const;

const itemLineCardStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '14px',
  padding: '16px',
  background: '#f8fafc'
} as const;

export function PurchaseOrderCreateScreen() {
  const router = useRouter();
  const { createPurchaseOrder, isSubmitting, error } = useCreatePurchaseOrder();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  const [values, setValues] = useState<PurchaseOrderFormValues>(initialPurchaseOrderFormValues);
  const [errors, setErrors] = useState<PurchaseOrderFormErrors>({});

  useEffect(() => {
    async function loadInventoryItems() {
      try {
        setIsInventoryLoading(true);
        const result = await inventoryApi.getInventoryList({ search: '', status: 'all' });
        setInventoryItems(result.items.filter((item) => item.isActive));
      } catch {
        setInventoryItems([]);
      } finally {
        setIsInventoryLoading(false);
      }
    }

    void loadInventoryItems();
  }, []);

  const totals = useMemo(() => calculatePurchaseOrderTotals(values), [values]);

  function updateField<K extends keyof PurchaseOrderFormValues>(
    field: K,
    value: PurchaseOrderFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  function updateLineField<K extends keyof PurchaseOrderFormLineValues>(
    index: number,
    field: K,
    value: PurchaseOrderFormLineValues[K]
  ) {
    setValues((current) => {
      const nextLines = [...current.lines];
      const nextLine = {
        ...nextLines[index],
        [field]: value
      };

      if (field === 'inventoryItemId') {
        const selected = inventoryItems.find((item) => item.id === value);

        if (selected) {
          if (!nextLine.unitCost || Number(nextLine.unitCost) === 0) {
            nextLine.unitCost = String(selected.standardCost);
          }

          nextLines[index] = nextLine;

          return {
            ...current,
            supplierName:
              current.supplierName.trim() || selected.preferredSupplierName || current.supplierName,
            currency: selected.currency || current.currency,
            lines: nextLines
          };
        }
      }

      nextLines[index] = nextLine;

      return {
        ...current,
        lines: nextLines
      };
    });

    setErrors((current) => {
      const next = { ...current };
      if (next.lineErrors && next.lineErrors[index]) {
        next.lineErrors[index] = {
          ...next.lineErrors[index],
          [field]: undefined
        };
      }
      next.lines = undefined;
      return next;
    });
  }

  function addLine() {
    setValues((current) => ({
      ...current,
      lines: [...current.lines, { ...initialPurchaseOrderLineValues }]
    }));
  }

  function removeLine(index: number) {
    setValues((current) => {
      if (current.lines.length === 1) {
        return current;
      }

      return {
        ...current,
        lines: current.lines.filter((_, lineIndex) => lineIndex !== index)
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validatePurchaseOrderForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      const created = await createPurchaseOrder(
        mapPurchaseOrderFormToCreateRequest(values, inventoryItems)
      );

      router.replace(`/orders/purchase-orders/${created.id}`);
      router.refresh();
    } catch {
      // hook error shown on screen
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
        <div style={{ marginBottom: '8px', fontSize: '30px', fontWeight: 700 }}>
          Create Purchase Order
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          Manual PO creation now supports line items with separate product name, SKU, barcode, qty,
          unit cost, and auto-calculated totals.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '24px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label htmlFor="supplierName" style={labelStyle}>Supplier Name</label>
              <input
                id="supplierName"
                value={values.supplierName}
                onChange={(e) => updateField('supplierName', e.target.value)}
                style={inputStyle}
              />
              {errors.supplierName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.supplierName}</div> : null}
            </div>

            <div>
              <label htmlFor="quotationNo" style={labelStyle}>Quotation No</label>
              <input
                id="quotationNo"
                value={values.quotationNo}
                onChange={(e) => updateField('quotationNo', e.target.value)}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="currency" style={labelStyle}>Currency</label>
              <input
                id="currency"
                value={values.currency}
                onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
                style={inputStyle}
              />
              {errors.currency ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.currency}</div> : null}
            </div>

            <div>
              <label htmlFor="expectedDate" style={labelStyle}>Expected Date</label>
              <input
                id="expectedDate"
                type="date"
                value={values.expectedDate}
                onChange={(e) => updateField('expectedDate', e.target.value)}
                style={inputStyle}
              />
              {errors.expectedDate ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.expectedDate}</div> : null}
            </div>

            <div>
              <label htmlFor="status" style={labelStyle}>Status</label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => updateField('status', e.target.value as PurchaseOrderFormValues['status'])}
                style={selectStyle}
              >
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
                <option value="partially_received">Partially received</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Item Count</label>
              <div style={{ ...inputStyle, background: '#f8fafc' }}>{totals.itemCount}</div>
            </div>

            <div>
              <label style={labelStyle}>Total Amount</label>
              <div style={{ ...inputStyle, background: '#f8fafc' }}>
                {values.currency} {totals.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
                Purchase Order Lines
              </div>
              <div style={{ color: '#475569' }}>
                Select product name and review SKU / barcode separately for each line.
              </div>
            </div>

            <button
              type="button"
              onClick={addLine}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Add Line
            </button>
          </div>

          {errors.lines ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {errors.lines}
            </div>
          ) : null}

          <div style={{ display: 'grid', gap: '16px' }}>
            {values.lines.map((line, index) => {
              const selected = inventoryItems.find((item) => item.id === line.inventoryItemId) || null;
              const qty = Number(line.orderedQty);
              const unitCost = Number(line.unitCost);
              const lineTotal =
                !Number.isNaN(qty) && !Number.isNaN(unitCost) ? qty * unitCost : 0;
              const lineError = errors.lineErrors?.[index] || {};

              return (
                <div key={index} style={itemLineCardStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Line {index + 1}</div>

                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={values.lines.length === 1}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: values.lines.length === 1 ? '#f8fafc' : '#ffffff',
                        color: values.lines.length === 1 ? '#94a3b8' : '#334155',
                        cursor: values.lines.length === 1 ? 'not-allowed' : 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Product Name</label>
                      <select
                        value={line.inventoryItemId}
                        onChange={(e) => updateLineField(index, 'inventoryItemId', e.target.value)}
                        style={selectStyle}
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
                      {lineError.inventoryItemId ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineError.inventoryItemId}</div> : null}
                    </div>

                    <div>
                      <label style={labelStyle}>SKU</label>
                      <div style={{ ...inputStyle, background: '#ffffff' }}>
                        {selected?.sku || '-'}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Barcode</label>
                      <div style={{ ...inputStyle, background: '#ffffff' }}>
                        {selected?.barcode || '-'}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Ordered Qty</label>
                      <input
                        value={line.orderedQty}
                        onChange={(e) => updateLineField(index, 'orderedQty', e.target.value)}
                        style={inputStyle}
                      />
                      {lineError.orderedQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineError.orderedQty}</div> : null}
                    </div>

                    <div>
                      <label style={labelStyle}>Unit Cost</label>
                      <input
                        value={line.unitCost}
                        onChange={(e) => updateLineField(index, 'unitCost', e.target.value)}
                        style={inputStyle}
                      />
                      {lineError.unitCost ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{lineError.unitCost}</div> : null}
                    </div>

                    <div>
                      <label style={labelStyle}>Line Total</label>
                      <div style={{ ...inputStyle, background: '#ffffff' }}>
                        {values.currency} {Number(lineTotal || 0).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Notes</label>
                      <input
                        value={line.notes}
                        onChange={(e) => updateLineField(index, 'notes', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    {selected ? (
                      <div
                        style={{
                          gridColumn: '1 / -1',
                          padding: '12px',
                          borderRadius: '10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          color: '#475569'
                        }}
                      >
                        <strong>{selected.name}</strong><br />
                        SKU: <strong>{selected.sku || '-'}</strong><br />
                        Barcode: <strong>{selected.barcode || '-'}</strong><br />
                        Preferred supplier: <strong>{selected.preferredSupplierName || '-'}</strong><br />
                        Standard cost: <strong>{selected.currency} {Number(selected.standardCost || 0).toFixed(2)}</strong><br />
                        Item type: <strong>{selected.itemType}</strong>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca'
            }}
          >
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isSubmitting ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create purchase order'}
          </button>

          <Link
            href="/orders/purchase-orders"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}