'use client';

import { useStockControl } from '../hooks/useStockControl';

function getSeverityStyle(severity: string) {
  if (severity === 'high') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  if (severity === 'medium') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  return {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  };
}

export function StockControlScreen() {
  const { summary, alerts, isLoading, error, refresh } = useStockControl();

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
              Stock Control / Forecasting
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              First planning intelligence layer for low stock, overstock, expiring soon, and expired alerts.
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

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading stock control summary...</div>
      ) : error ? (
        <div style={{ color: '#b91c1c' }}>{error}</div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginBottom: '24px'
            }}
          >
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Items</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Low Stock</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.lowStockItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Out of Stock</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.outOfStockItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Overstock</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.overstockItems}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Expiring Soon</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.expiringSoonBatches}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Expired Batches</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.expiredBatches}</div>
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
            <div style={{ padding: '20px', fontSize: '22px', fontWeight: 700 }}>
              Alerts
            </div>

            {alerts.length === 0 ? (
              <div style={{ padding: '24px', color: '#64748b' }}>No alerts found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Severity</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Message</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Reference</th>
                      <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>{alert.alertType}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '6px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 700,
                              ...getSeverityStyle(alert.severity)
                            }}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.title}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.message}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                          {alert.referenceType} / {alert.referenceId}
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{alert.dueDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}