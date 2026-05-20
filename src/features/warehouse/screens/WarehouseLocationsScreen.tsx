'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useWarehouseLocations } from '../hooks/useWarehouseLocations';

function getStatusColor(status: string) {
  if (status === 'available') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'limited') {
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

export function WarehouseLocationsScreen() {
  const {
    locations,
    filters,
    isLoading,
    error,
    totalVisible,
    updateSearch,
    updateStatus,
    refresh
  } = useWarehouseLocations();

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
              Warehouse Locations
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              First warehouse locations listing is ready with mock operational data.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.warehouse}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to warehouse
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
            <label htmlFor="location-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="location-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search code, zone, aisle, bin"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="location-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="location-status"
              value={filters.status || 'all'}
              onChange={(event) =>
                updateStatus(event.target.value as 'all' | 'available' | 'limited' | 'full')
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
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="full">Full</option>
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              color: '#475569',
              fontWeight: 600
            }}
          >
            Visible locations: {totalVisible}
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
          <div style={{ padding: '24px', color: '#64748b' }}>Loading warehouse locations...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : locations.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No warehouse locations found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Code</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Zone</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Aisle</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Bin</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Capacity</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Occupied</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Items</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.code}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.zone}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.aisle}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.bin}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.capacity}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.occupied} ({item.utilizationPercent}%)
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.itemCount}</td>
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
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {new Date(item.updatedAt).toLocaleString()}
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