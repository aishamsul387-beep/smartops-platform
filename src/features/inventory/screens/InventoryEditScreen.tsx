'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useInventoryDetail } from '../hooks/useInventoryDetail';
import { useInventoryMasterOptions } from '../hooks/useInventoryMasterOptions';
import { useUpdateInventory } from '../hooks/useUpdateInventory';
import {
  mapInventoryFormToCreateRequest,
  validateInventoryForm,
  type InventoryFormErrors,
  type InventoryFormValues
} from '../schema';

export function InventoryEditScreen({ id }: { id: string }) {
  const router = useRouter();
  const { item, isLoading, error, refresh } = useInventoryDetail(id);
  const { uoms, conversionGroups, isLoading: isOptionsLoading } = useInventoryMasterOptions();
  const { updateInventory, isSubmitting, error: submitError } = useUpdateInventory();

  const [values, setValues] = useState<InventoryFormValues | null>(null);
  const [errors, setErrors] = useState<InventoryFormErrors>({});

  useEffect(() => {
    if (!item) {
      return;
    }

    setValues({
      sku: item.sku,
      barcode: item.barcode,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: String(item.quantity),
      reorderLevel: String(item.reorderLevel),
      minimumStockLevel: String(item.minimumStockLevel),
      maximumStockLevel: String(item.maximumStockLevel),
      unit: item.unit,
      warehouseLocation: item.warehouseLocation,
      status: item.status,
      isActive: item.isActive,
      isBatchTracked: item.isBatchTracked,
      isExpiryTracked: item.isExpiryTracked,
      isSerialTracked: item.isSerialTracked,
      baseUomCode: item.baseUomCode,
      purchaseUomCode: item.purchaseUomCode,
      salesUomCode: item.salesUomCode,
      issueUomCode: item.issueUomCode,
      uomConversionGroupCode: item.uomConversionGroupCode,
      allowsFraction: item.allowsFraction,
      notes: item.notes
    });
  }, [item]);

  function updateField<K extends keyof InventoryFormValues>(
    field: K,
    value: InventoryFormValues[K]
  ) {
    setValues((current) =>
      current
        ? {
            ...current,
            [field]: value
          }
        : current
    );

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values) {
      return;
    }

    const result = validateInventoryForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      await updateInventory({
        id,
        ...mapInventoryFormToCreateRequest(values)
      });

      router.replace(`/inventory/${id}`);
      router.refresh();
    } catch {
      // error shown on screen
    }
  }

  if (isLoading || !values) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading inventory item...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error || 'Inventory item not found'}</div>
          <button
            type="button"
            onClick={() => void refresh()}
            style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '30px', fontWeight: 700 }}>
          Edit Inventory Item
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          Update inventory master governance fields, UOM policy, tracking flags, thresholds, and notes.
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
            <input id="unit" value={values.unit} onChange={(e) => updateField('unit', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.unit ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.unit}</div> : null}
          </div>

          <div>
            <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Location</label>
            <input id="warehouseLocation" value={values.warehouseLocation} onChange={(e) => updateField('warehouseLocation', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.warehouseLocation ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseLocation}</div> : null}
          </div>

          <div>
            <label htmlFor="baseUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Base UOM</label>
            <select
              id="baseUomCode"
              value={values.baseUomCode}
              onChange={(e) => updateField('baseUomCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">{isOptionsLoading ? 'Loading UOM...' : 'Select base UOM'}</option>
              {uoms.map((item) => (
                <option key={item.id} value={item.uomCode}>
                  {item.uomCode} - {item.uomName}
                </option>
              ))}
            </select>
            {errors.baseUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.baseUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="purchaseUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Purchase UOM</label>
            <select
              id="purchaseUomCode"
              value={values.purchaseUomCode}
              onChange={(e) => updateField('purchaseUomCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">{isOptionsLoading ? 'Loading UOM...' : 'Select purchase UOM'}</option>
              {uoms.map((item) => (
                <option key={item.id} value={item.uomCode}>
                  {item.uomCode} - {item.uomName}
                </option>
              ))}
            </select>
            {errors.purchaseUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.purchaseUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="salesUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Sales UOM</label>
            <select
              id="salesUomCode"
              value={values.salesUomCode}
              onChange={(e) => updateField('salesUomCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">{isOptionsLoading ? 'Loading UOM...' : 'Select sales UOM'}</option>
              {uoms.map((item) => (
                <option key={item.id} value={item.uomCode}>
                  {item.uomCode} - {item.uomName}
                </option>
              ))}
            </select>
            {errors.salesUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.salesUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="issueUomCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Issue UOM</label>
            <select
              id="issueUomCode"
              value={values.issueUomCode}
              onChange={(e) => updateField('issueUomCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">{isOptionsLoading ? 'Loading UOM...' : 'Select issue UOM'}</option>
              {uoms.map((item) => (
                <option key={item.id} value={item.uomCode}>
                  {item.uomCode} - {item.uomName}
                </option>
              ))}
            </select>
            {errors.issueUomCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.issueUomCode}</div> : null}
          </div>

          <div>
            <label htmlFor="uomConversionGroupCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>UOM Conversion Group</label>
            <select
              id="uomConversionGroupCode"
              value={values.uomConversionGroupCode}
              onChange={(e) => updateField('uomConversionGroupCode', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">
                {isOptionsLoading ? 'Loading groups...' : 'Select conversion group (optional)'}
              </option>
              {conversionGroups.map((item) => (
                <option key={item.id} value={item.groupCode}>
                  {item.groupCode} - {item.groupName}
                </option>
              ))}
            </select>
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

        {submitError ? (
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
            {submitError}
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
            {isSubmitting ? 'Saving...' : 'Update inventory item'}
          </button>

          <Link
            href={`/inventory/${id}`}
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