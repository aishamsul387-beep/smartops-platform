'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useCreateInventory } from '../hooks/useCreateInventory';
import {
  initialInventoryFormValues,
  mapInventoryFormToCreateRequest,
  validateInventoryForm,
  type InventoryFormErrors,
  type InventoryFormValues
} from '../schema';
import { useState, type FormEvent } from 'react';

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
          This is the first reusable create flow for the Inventory module. It uses feature-owned
          validation and a mock create API until the real backend contract is connected.
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
            <label htmlFor="sku" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              SKU
            </label>
            <input
              id="sku"
              value={values.sku}
              onChange={(event) => updateField('sku', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.sku ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.sku}</div> : null}
          </div>

          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Name
            </label>
            <input
              id="name"
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.name ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.name}</div> : null}
          </div>

          <div>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Category
            </label>
            <input
              id="category"
              value={values.category}
              onChange={(event) => updateField('category', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.category ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.category}</div> : null}
          </div>

          <div>
            <label htmlFor="unit" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Unit
            </label>
            <input
              id="unit"
              value={values.unit}
              onChange={(event) => updateField('unit', event.target.value)}
              placeholder="pcs / box / kg"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.unit ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.unit}</div> : null}
          </div>

          <div>
            <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Quantity
            </label>
            <input
              id="quantity"
              value={values.quantity}
              onChange={(event) => updateField('quantity', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.quantity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.quantity}</div> : null}
          </div>

          <div>
            <label htmlFor="reorderLevel" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Reorder Level
            </label>
            <input
              id="reorderLevel"
              value={values.reorderLevel}
              onChange={(event) => updateField('reorderLevel', event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.reorderLevel ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.reorderLevel}</div> : null}
          </div>

          <div>
            <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Warehouse Location
            </label>
            <input
              id="warehouseLocation"
              value={values.warehouseLocation}
              onChange={(event) => updateField('warehouseLocation', event.target.value)}
              placeholder="A-01-01"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {errors.warehouseLocation ? (
              <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseLocation}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) =>
                updateField('status', event.target.value as InventoryFormValues['status'])
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
            {errors.status ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.status}</div> : null}
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
            {isSubmitting ? 'Creating...' : 'Create item'}
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