'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useWarehouseSummary } from '../hooks/useWarehouseSummary';
import type { WarehouseSiteScope } from '../types';

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function getScopeLabel(siteScope: WarehouseSiteScope) {
  if (siteScope === 'warehouse') {
    return 'Warehouse only';
  }

  if (siteScope === 'outlet') {
    return 'Outlet only';
  }

  return 'All sites';
}

export function WarehouseScreen() {
  const {
    summary,
    siteScope,
    warehouseCode,
    isLoading,
    error,
    setSiteScope,
    setWarehouseCode,
    refresh
  } = useWarehouseSummary();

  const activeBase = summary.activeLocations > 0 ? summary.activeLocations : summary.totalLocations;

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
              Warehouse overview now supports site-aware utilization prep for warehouse and outlet filtering.
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

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Warehouse Overview Filters
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
          Filter utilization by site scope and optional warehouse/outlet code so each site can be measured on its own.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Site Scope</label>
            <select
              value={siteScope}
              onChange={(e) => setSiteScope(e.target.value as WarehouseSiteScope)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">all</option>
              <option value="warehouse">warehouse</option>
              <option value="outlet">outlet</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Warehouse / Outlet Code
            </label>
            <input
              value={warehouseCode}
              onChange={(e) => setWarehouseCode(e.target.value)}
              placeholder="Example: WH-001 or OTL-001"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
            <div style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
              Leave blank to include all sites within the selected scope.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#334155'
          }}
        >
          <strong>Current filter:</strong> {getScopeLabel(siteScope)}
          {summary.warehouseCode ? ` â€¢ ${summary.warehouseCode}` : ' â€¢ all codes'}
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading warehouse summary...</div>
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
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Active Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.activeLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Inactive Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.inactiveLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Full Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.fullLocations}</div>
              <div style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
                Based on {activeBase} active/total location base
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Full Location %</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPercent(summary.fullLocationPct)}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Empty Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.emptyLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Occupied Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.occupiedLocations}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Blocked Locations</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.blockedLocations}</div>
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
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Pallet Utilization</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPercent(summary.palletUtilizationPct)}</div>
              <div style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
                {summary.palletCapacityUsed} / {summary.palletCapacityTotal}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>PCS Utilization</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPercent(summary.pcsUtilizationPct)}</div>
              <div style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
                {summary.pcsCapacityUsed} / {summary.pcsCapacityTotal}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Carton Utilization</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPercent(summary.cartonUtilizationPct)}</div>
              <div style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>
                {summary.cartonCapacityUsed} / {summary.cartonCapacityTotal}
              </div>
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
              This summary is now measured by the selected site scope and optional warehouse/outlet code.
              Use the filters above to inspect each warehouse or outlet on its own instead of mixing all sites together.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

