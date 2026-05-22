'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useInventoryDetail } from '../hooks/useInventoryDetail';

function getStatusColor(status: string) {
  if (status === 'in_stock') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'low_stock') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  return {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  };
}

export function InventoryDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = useInventoryDetail(id);

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading inventory item...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>
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

  if (!item) {
    return (
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Inventory item not found
          </div>
          <div style={{ color: '#475569', marginBottom: '16px' }}>
            The requested inventory item could not be found.
          </div>
          <Link href={ROUTES.inventory} style={{ color: '#2563eb', fontWeight: 600 }}>
            Back to inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              {item.name}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Inventory master detail now includes UOM policy, tracking flags, and stock control fields.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.inventory} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to inventory
            </Link>
            <Link href={ROUTES.inventoryCreate} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f766e', color: '#ffffff', fontWeight: 600 }}>
              Create another
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>SKU</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.sku}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Barcode</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.barcode || '-'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Category</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.category}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Quantity</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.quantity} {item.unit}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Reorder / Min / Max</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>
            {item.reorderLevel} / {item.minimumStockLevel} / {item.maximumStockLevel}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Warehouse Location</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.warehouseLocation}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>UOM Group</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{item.uomConversionGroupCode || '-'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Status</div>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              ...getStatusColor(item.status)
            }}
          >
            {item.statusLabel}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Tracking Policy</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>
            Active: <strong>{item.isActive ? 'Yes' : 'No'}</strong><br />
            Batch Tracked: <strong>{item.isBatchTracked ? 'Yes' : 'No'}</strong><br />
            Expiry Tracked: <strong>{item.isExpiryTracked ? 'Yes' : 'No'}</strong><br />
            Serial Tracked: <strong>{item.isSerialTracked ? 'Yes' : 'No'}</strong><br />
            Allows Fraction: <strong>{item.allowsFraction ? 'Yes' : 'No'}</strong>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>UOM Policy</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>
            Base UOM: <strong>{item.baseUomCode || '-'}</strong><br />
            Purchase UOM: <strong>{item.purchaseUomCode || '-'}</strong><br />
            Sales UOM: <strong>{item.salesUomCode || '-'}</strong><br />
            Issue UOM: <strong>{item.issueUomCode || '-'}</strong>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Description</div>
        <div style={{ color: '#475569', lineHeight: 1.8 }}>
          {item.description || 'No description provided.'}
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Notes & Last Updated</div>
        <div style={{ color: '#475569', lineHeight: 1.8 }}>
          Notes: <strong>{item.notes || '-'}</strong><br />
          Updated: <strong>{new Date(item.updatedAt).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}