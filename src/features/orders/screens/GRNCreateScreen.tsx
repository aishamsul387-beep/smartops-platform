'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { useCreateGRN } from '../hooks/useCreateGRN';
import { initialGRNFormValues, mapGRNFormToRequest, validateGRNForm } from '../schema';
import type { GRNFormErrors, GRNFormValues } from '../types';

export function GRNCreateScreen() {
  const router = useRouter();
  const { createGRN, isSubmitting, error } = useCreateGRN();

  const [values, setValues] = useState<GRNFormValues>(initialGRNFormValues);
  const [errors, setErrors] = useState<GRNFormErrors>({});

  function updateField<K extends keyof GRNFormValues>(field: K, value: GRNFormValues[K]) {
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

    const result = validateGRNForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      const created = await createGRN(mapGRNFormToRequest(values));
      router.replace(ROUTES.goodsReceivedNoteDetail(created.id));
      router.refresh();
    } catch {
      // hook error shown on screen
    }
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Create Goods Received Note</div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          First GRN create flow is ready using feature-owned validation and mock create logic.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="poNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>PO No</label>
            <input
              id="poNo"
              value={values.poNo}
              onChange={(event) => updateField('poNo', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.poNo ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.poNo}</div> : null}
          </div>

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
            <label htmlFor="receivedLines" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Received Lines</label>
            <input
              id="receivedLines"
              value={values.receivedLines}
              onChange={(event) => updateField('receivedLines', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.receivedLines ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedLines}</div> : null}
          </div>

          <div>
            <label htmlFor="receivedQty" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Received Qty</label>
            <input
              id="receivedQty"
              value={values.receivedQty}
              onChange={(event) => updateField('receivedQty', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.receivedQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedQty}</div> : null}
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="status"
              value={values.status}
              onChange={(event) => updateField('status', event.target.value as GRNFormValues['status'])}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
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
            {isSubmitting ? 'Creating...' : 'Create GRN'}
          </button>

          <Link
            href={ROUTES.goodsReceivedNotes}
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}