'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { useCreatePurchaseOrder } from '../hooks/useCreatePurchaseOrder';
import {
  initialPurchaseOrderFormValues,
  mapPurchaseOrderFormToRequest,
  validatePurchaseOrderForm
} from '../schema';
import type { PurchaseOrderFormErrors, PurchaseOrderFormValues } from '../types';

export function PurchaseOrderCreateScreen() {
  const router = useRouter();
  const { createPurchaseOrder, isSubmitting, error } = useCreatePurchaseOrder();

  const [values, setValues] = useState<PurchaseOrderFormValues>(initialPurchaseOrderFormValues);
  const [errors, setErrors] = useState<PurchaseOrderFormErrors>({});

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validatePurchaseOrderForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      const created = await createPurchaseOrder(mapPurchaseOrderFormToRequest(values));
      router.replace(ROUTES.purchaseOrderDetail(created.id));
      router.refresh();
    } catch {
      // hook error is shown
    }
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Create Purchase Order</div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          First purchase order create flow is ready using feature-owned validation and mock create logic.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="supplierName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Supplier Name</label>
            <input
              id="supplierName"
              value={values.supplierName}
              onChange={(event) => updateField('supplierName', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.supplierName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.supplierName}</div> : null}
          </div>

          <div>
            <label htmlFor="quotationNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Quotation No</label>
            <input
              id="quotationNo"
              value={values.quotationNo}
              onChange={(event) => updateField('quotationNo', event.target.value)}
              placeholder="Optional"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="itemCount" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Item Count</label>
            <input
              id="itemCount"
              value={values.itemCount}
              onChange={(event) => updateField('itemCount', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.itemCount ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.itemCount}</div> : null}
          </div>

          <div>
            <label htmlFor="totalAmount" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Total Amount</label>
            <input
              id="totalAmount"
              value={values.totalAmount}
              onChange={(event) => updateField('totalAmount', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.totalAmount ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.totalAmount}</div> : null}
          </div>

          <div>
            <label htmlFor="currency" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Currency</label>
            <input
              id="currency"
              value={values.currency}
              onChange={(event) => updateField('currency', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.currency ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.currency}</div> : null}
          </div>

          <div>
            <label htmlFor="expectedDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Expected Date</label>
            <input
              id="expectedDate"
              type="date"
              value={values.expectedDate}
              onChange={(event) => updateField('expectedDate', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.expectedDate ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.expectedDate}</div> : null}
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="status"
              value={values.status}
              onChange={(event) => updateField('status', event.target.value as PurchaseOrderFormValues['status'])}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="draft">Draft</option>
              <option value="issued">Issued</option>
              <option value="partially_received">Partially received</option>
              <option value="received">Received</option>
            </select>
          </div>
        </div>

        {error ? (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: '12px 16px', borderRadius: '10px', border: 'none', background: isSubmitting ? '#94a3b8' : '#0f172a', color: '#ffffff', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {isSubmitting ? 'Creating...' : 'Create purchase order'}
          </button>

          <Link
            href={ROUTES.purchaseOrders}
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}