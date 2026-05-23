'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ROUTES } from '@/lib/routes';
import { useCreateGRN } from '../hooks/useCreateGRN';
import { initialGRNFormValues, mapGRNFormToRequest, validateGRNForm } from '../schema';
import type { GRNFormErrors, GRNFormValues } from '../types';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';

export function GRNCreateScreen() {
  const router = useRouter();
  const { createGRN, isSubmitting, error } = useCreateGRN();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  const [values, setValues] = useState<GRNFormValues>(initialGRNFormValues);
  const [errors, setErrors] = useState<GRNFormErrors>({});

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
          This GRN flow can now create linked batch traceability when posted.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="poNo" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>PO No</label>
            <input id="poNo" value={values.poNo} onChange={(e) => updateField('poNo', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.poNo ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.poNo}</div> : null}
          </div>

          <div>
            <label htmlFor="inventoryItemId" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Inventory Item</label>
            <select
              id="inventoryItemId"
              value={values.inventoryItemId}
              onChange={(e) => updateField('inventoryItemId', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">
                {isInventoryLoading ? 'Loading inventory...' : 'Select inventory item'}
              </option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} - {item.name}
                </option>
              ))}
            </select>
            {errors.inventoryItemId ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.inventoryItemId}</div> : null}
          </div>

          <div>
            <label htmlFor="supplierName" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Supplier Name</label>
            <input id="supplierName" value={values.supplierName} onChange={(e) => updateField('supplierName', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.supplierName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.supplierName}</div> : null}
          </div>

          <div>
            <label htmlFor="batchNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Batch Number</label>
            <input id="batchNumber" value={values.batchNumber} onChange={(e) => updateField('batchNumber', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.batchNumber ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.batchNumber}</div> : null}
          </div>

          <div>
            <label htmlFor="lotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Lot Number</label>
            <input id="lotNumber" value={values.lotNumber} onChange={(e) => updateField('lotNumber', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="supplierLotNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Supplier Lot Number</label>
            <input id="supplierLotNumber" value={values.supplierLotNumber} onChange={(e) => updateField('supplierLotNumber', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="manufactureDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Manufacture Date</label>
            <input id="manufactureDate" type="date" value={values.manufactureDate} onChange={(e) => updateField('manufactureDate', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Expiry Date</label>
            <input id="expiryDate" type="date" value={values.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="receivedDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Received Date</label>
            <input id="receivedDate" type="date" value={values.receivedDate} onChange={(e) => updateField('receivedDate', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="receivedLines" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Received Lines</label>
            <input id="receivedLines" value={values.receivedLines} onChange={(e) => updateField('receivedLines', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.receivedLines ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedLines}</div> : null}
          </div>

          <div>
            <label htmlFor="receivedQty" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Received Qty</label>
            <input id="receivedQty" value={values.receivedQty} onChange={(e) => updateField('receivedQty', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            {errors.receivedQty ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.receivedQty}</div> : null}
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => updateField('status', e.target.value as GRNFormValues['status'])}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
          </div>

          <div>
            <label htmlFor="warehouseLocation" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Location</label>
            <input id="warehouseLocation" value={values.warehouseLocation} onChange={(e) => updateField('warehouseLocation', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="zone" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zone</label>
            <input id="zone" value={values.zone} onChange={(e) => updateField('zone', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="aisle" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Aisle</label>
            <input id="aisle" value={values.aisle} onChange={(e) => updateField('aisle', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="levelCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Level</label>
            <input id="levelCode" value={values.levelCode} onChange={(e) => updateField('levelCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label htmlFor="bin" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bin</label>
            <input id="bin" value={values.bin} onChange={(e) => updateField('bin', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
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