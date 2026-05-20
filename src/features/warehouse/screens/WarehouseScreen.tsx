'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useWarehouseSummary } from '../hooks/useWarehouseSummary';

export function WarehouseScreen() {
  const { summary, isLoading, error, refresh } = useWarehouseSummary();

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
              Warehouse
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Sprint 3 warehouse foundation is ready. This overview links the first warehouse
              locations flow and the first task list flow.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.warehouseLocations}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f766e',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Open locations
            </Link>

            <Link
              href={ROUTES.warehouseTasks}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Open tasks
            </Link>

            <button
              type="button"
              onClick={() => void refresh()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading warehouse summary...</div>
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
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Total locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Active locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.activeLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Full locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.fullLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Utilization</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.utilizationPercent}%</div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
              Current warehouse snapshot
            </div>
            <div style={{ color: '#475569', lineHeight: 1.7 }}>
              Total occupied capacity is <strong>{summary.totalOccupied}</strong> out of{' '}
              <strong>{summary.totalCapacity}</strong>. Continue next with task detail and status
              transitions after this foundation is stable.
            </div>
          </div>
        </>
      )}
    </div>
  );
}