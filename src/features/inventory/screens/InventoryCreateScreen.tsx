'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { useCreateInventory } from '../hooks/useCreateInventory';
import {
  initialInventoryFormValues,
  mapInventoryFormToCreateRequest,
  validateInventoryForm,
  type InventoryFormErrors,
  type InventoryFormValues
} from '../schema';

export function InventoryCreateScreen() {
  const router = useRouter();
  const { createInventory, isSubmitting, error } = useCreateInventory();

  const [values, setValues] = useState<InventoryFormValues>(initialInventoryFormValues);
  const [errors, setErrors] = useState<InventoryFormErrors>({});

  function updateField<K extends keyof InventoryFormValues>(
    field: K,
    value: InventoryFormValues[K]
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

    const result = validateInventoryForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      const created = await createInventory(mapInventoryFormToCreateRequest(values));
      router.replace(`/inventory/${created.id}`);
      router.refresh();
    } catch {
      // hook error is shown on screen
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
          Create Inventory Item
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          Inventory master now supports barcode, UOM assignments, tracking policies, stock thresholds,
          and richer item-level control fields.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
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
            <label htmlFor="sku" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>SKU</label>
            <input id="sku" value={values.sku} onChange={(e) => updateField('sku', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.sku ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.sku}</div> : null}
          </div>

          <div>
            <label htmlFor="barcode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Barcode</label>
            <input id="barcode" value={values.barcode} onChange={(e) => updateField('barcode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name</label>
            <input id="name" value={values.name} onChange={(e) => updateField('name', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.name ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.name}</div> : null}
          </div>

          <div>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category</label>
            <input id="category" value={values.category} onChange={(e) => updateField('category', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.category ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.category}</div> : null}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
            <textarea id="description" value={values.description} onChange={(e) => updateField('description', e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
          </div>

          <div>
            <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Quantity</label>
            <input id="quantity" value={values.quantity} onChange={(e) => updateField('quantity', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.quantity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.quantity}</div> : null}
          </div>

          <div>
            <label htmlFor="reorderLevel" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Reorder Level</label>
            <input id="reorderLevel" value={values.reorderLevel} onChange={(e) => updateField('reorderLevel', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.reorderLevel ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.reorderLevel}</div> : null}
          </div>

          <div>
            <label htmlFor="minimumStockLevel" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Minimum Stock Level</label>
            <input id="minimumStockLevel" value={values.minimumStockLevel} onChange={(e) => updateField('minimumStockLevel', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.minimumStockLevel ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.minimumStockLevel}</div> : null}
          </div>

          <div>
            <label htmlFor="maximumStockLevel" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Maximum Stock Level</label>
            <input id="maximumStockLevel" value={values.maximumStockLevel} onChange={(e) => updateField('maximumStockLevel', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.maximumStockLevel ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.maximumStockLevel}</div> : null}
          </div>

          <div>
            <label htmlFor="unit" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Display Unit</label>
            <input id="unit" value={values.unit} onChange={(e) => updateField('unit', e.target.value)} placeholder="PCS" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.unit ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.unit}</div> : null}
          </div>

          <div>
            <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Location</label>
            <input id="warehouseLocation" value={values.warehouseLocation} onChange={(e) => updateField('warehouseLocation', e.target.value)} placeholder="A-01-01" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.warehouseLocation ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseLocation}</div> : null}
          </div>

          <div>
            <label htmlFor="baseUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Base UOM</label>
            <input id="baseUomCode" value={values.baseUomCode} onChange={(e) => updateField('baseUomCode', e.target.value)} placeholder="PCS" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.baseUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.baseUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="purchaseUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Purchase UOM</label>
            <input id="purchaseUomCode" value={values.purchaseUomCode} onChange={(e) => updateField('purchaseUomCode', e.target.value)} placeholder="CTN" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.purchaseUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.purchaseUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="salesUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Sales UOM</label>
            <input id="salesUomCode" value={values.salesUomCode} onChange={(e) => updateField('salesUomCode', e.target.value)} placeholder="PCS" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.salesUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.salesUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="issueUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Issue UOM</label>
            <input id="issueUomCode" value={values.issueUomCode} onChange={(e) => updateField('issueUomCode', e.target.value)} placeholder="PCS" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.issueUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.issueUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="uomConversionGroupCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>UOM Conversion Group</label>
            <input id="uomConversionGroupCode" value={values.uomConversionGroupCode} onChange={(e) => updateField('uomConversionGroupCode', e.target.value)} placeholder="PK_STD_001" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => updateField('status', e.target.value as InventoryFormValues['status'])}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '12px' }}>
            <div style={{ fontWeight: 600 }}>Tracking & Policy Flags</div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label><input type="checkbox" checked={values.isActive} onChange={(e) => updateField('isActive', e.target.checked)} /> Active</label>
              <label><input type="checkbox" checked={values.isBatchTracked} onChange={(e) => updateField('isBatchTracked', e.target.checked)} /> Batch Tracked</label>
              <label><input type="checkbox" checked={values.isExpiryTracked} onChange={(e) => updateField('isExpiryTracked', e.target.checked)} /> Expiry Tracked</label>
              <label><input type="checkbox" checked={values.isSerialTracked} onChange={(e) => updateField('isSerialTracked', e.target.checked)} /> Serial Tracked</label>
              <label><input type="checkbox" checked={values.allowsFraction} onChange={(e) => updateField('allowsFraction', e.target.checked)} /> Allows Fraction</label>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Notes</label>
            <textarea id="notes" value={values.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
          </div>
        </div>

        {error ? (
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
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
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
            {isSubmitting ? 'Creating...' : 'Create inventory item'}
          </button>

          <Link
            href={ROUTES.inventory}
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