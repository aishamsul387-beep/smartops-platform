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
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Inventory item not found
          </div>
          <div style={{ color: '#475569', marginBottom: '16px' }}>
            The requested inventory item could not be found in the current mock inventory store.
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
              {item.name}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Inventory detail view is now ready. This is the first detail route pattern for your
              business modules.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.inventory}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to inventory
            </Link>

            <Link
              href={ROUTES.inventoryCreate}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f766e',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Create another
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>SKU</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.sku}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Category</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.category}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Quantity</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {item.quantity} {item.unit}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Reorder Level</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {item.reorderLevel} {item.unit}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Warehouse Location</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.warehouseLocation}</div>
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

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '24px'
        }}
      >
        <div style={{ color: '#64748b', marginBottom: '8px' }}>Last updated</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>
          {new Date(item.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}