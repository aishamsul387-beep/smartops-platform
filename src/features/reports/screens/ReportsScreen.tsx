'use client';

import { useReports } from '../hooks/useReports';

function getStatusColor(status: string) {
  if (status === 'ready') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  return {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a'
  };
}

export function ReportsScreen() {
  const { metrics, rows, filters, isLoading, error, updateSearch, updateKind, refresh } =
    useReports();

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
              Reports
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Reports foundation now shows contract-ready KPI cards and report rows. Export wiring
              can be added later without changing route structure.
            </div>
          </div>

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

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px'
            }}
          >
            <div style={{ color: '#64748b', marginBottom: '8px' }}>{metric.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
              {metric.value}
            </div>
            <div style={{ color: '#475569' }}>{metric.helperText || '-'}</div>
          </div>
        ))}
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
            <label htmlFor="reports-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="reports-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search report name, owner, kind"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="reports-kind" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Report Type
            </label>
            <select
              id="reports-kind"
              value={filters.kind || 'all'}
              onChange={(event) =>
                updateKind(
                  event.target.value as
                    | 'all'
                    | 'inventory-summary'
                    | 'stock-alerts'
                    | 'warehouse-utilization'
                    | 'procurement-overview'
                )
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
              <option value="inventory-summary">Inventory Summary</option>
              <option value="stock-alerts">Stock Alerts</option>
              <option value="warehouse-utilization">Warehouse Utilization</option>
              <option value="procurement-overview">Procurement Overview</option>
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
          <div style={{ padding: '24px', color: '#64748b' }}>Loading reports...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No reports found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Report Name</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Owner</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Generated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.reportName}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.reportKindLabel}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.owner}</td>
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
                      {new Date(item.generatedAt).toLocaleString()}
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