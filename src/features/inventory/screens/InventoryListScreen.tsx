'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useInventoryList } from '../hooks/useInventoryList';

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

export function InventoryListScreen() {
  const {
    items,
    filters,
    isLoading,
    error,
    totalItems,
    lowStockCount,
    outOfStockCount,
    updateSearch,
    updateStatus,
    refresh
  } = useInventoryList();

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
              Inventory
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Inventory master now includes richer operational fields like barcode, UOM policy,
              tracking flags, and stock thresholds.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.dashboard}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to dashboard
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
              Create item
            </Link>

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
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total items</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{totalItems}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Low stock</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{lowStockCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Out of stock</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{outOfStockCount}</div>
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
            <label htmlFor="inventory-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="inventory-search"
              type="text"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by SKU, barcode, name or category"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="inventory-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="inventory-status"
              value={filters.status || 'all'}
              onChange={(event) =>
                updateStatus(event.target.value as 'all' | 'in_stock' | 'low_stock' | 'out_of_stock')
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
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
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
          <div style={{ padding: '24px', color: '#64748b' }}>Loading inventory...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No inventory items found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Barcode</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Category</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qty / Min / Max</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Base UOM</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Tracking</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Active</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>{item.sku}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.barcode || '-'}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <Link href={`/inventory/${item.id}`} style={{ color: '#2563eb', fontWeight: 600 }}>
                        {item.name}
                      </Link>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.category}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.quantity} / {item.minimumStockLevel} / {item.maximumStockLevel}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.baseUomCode || '-'}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {[
                        item.isBatchTracked ? 'Batch' : null,
                        item.isExpiryTracked ? 'Expiry' : null,
                        item.isSerialTracked ? 'Serial' : null
                      ]
                        .filter(Boolean)
                        .join(', ') || 'None'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.isActive ? 'Yes' : 'No'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}