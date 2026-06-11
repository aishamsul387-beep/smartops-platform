'use client';

import { useInventoryTransfers } from '../hooks/useInventoryTransfers';

export function InventoryTransferHistorySection() {
  const {
    items,
    total,
    filters,
    isLoading,
    error,
    updateSearch,
    updateWarehouseLocation,
    refresh
  } = useInventoryTransfers();

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
        Transfer History
      </div>
      <div style={{ color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
        Review recently posted transfers and search by item or location.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Search
          </label>
          <input
            value={filters.search || ''}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by item, SKU, reason or location"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Location Filter
          </label>
          <input
            value={filters.warehouseLocation || ''}
            onChange={(e) => updateWarehouseLocation(e.target.value)}
            placeholder="Filter by from/to location"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'end' }}>
          <button
            type="button"
            onClick={() => void refresh()}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            Refresh History
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading transfer history...</div>
      ) : error ? (
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
      ) : items.length === 0 ? (
        <div style={{ color: '#64748b' }}>No transfer history found.</div>
      ) : (
        <>
          <div style={{ color: '#64748b', marginBottom: '12px' }}>
            Total transfer records: <strong>{total}</strong>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Transfer ID</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Item</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>From</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>To</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Reason</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{item.sku}</div>
                      <div>{item.itemName}</div>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.fromWarehouseLocation}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.toWarehouseLocation}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.reason}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
