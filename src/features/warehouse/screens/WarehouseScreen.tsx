'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useWarehouseDrilldown } from '../hooks/useWarehouseDrilldown';
import { useWarehouseSites } from '../hooks/useWarehouseSites';
import { useWarehouseSummary } from '../hooks/useWarehouseSummary';
import type { WarehouseSiteScope, WarehouseUtilizationDrilldownBucket } from '../types';

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

function renderUtilizationPair(label: string, used: number, total: number, pct: number) {
  return (
    <div style={{ fontSize: '13px', color: '#475569' }}>
      <strong>{label}:</strong> {used} / {total} ({formatPercent(pct)})
    </div>
  );
}

function DrilldownTable({
  title,
  description,
  rows
}: {
  title: string;
  description: string;
  rows: WarehouseUtilizationDrilldownBucket[];
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px'
      }}
    >
      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>{title}</div>
      <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>{description}</div>

      {rows.length === 0 ? (
        <div style={{ color: '#64748b' }}>No drill-down data found for the current filter.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Group</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Locations</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Full %</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Pallet</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PCS</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Carton</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                    {row.label}
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                    <div>Total: {row.totalLocations}</div>
                    <div>Active: {row.activeLocations}</div>
                    <div>Occupied: {row.occupiedLocations}</div>
                    <div>Empty: {row.emptyLocations}</div>
                    <div>Blocked: {row.blockedLocations}</div>
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700 }}>{formatPercent(row.fullLocationPct)}</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {row.fullLocations} full
                    </div>
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                    {renderUtilizationPair('Utilization', row.palletCapacityUsed, row.palletCapacityTotal, row.palletUtilizationPct)}
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                    {renderUtilizationPair('Utilization', row.pcsCapacityUsed, row.pcsCapacityTotal, row.pcsUtilizationPct)}
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                    {renderUtilizationPair('Utilization', row.cartonCapacityUsed, row.cartonCapacityTotal, row.cartonUtilizationPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
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

  const {
    items: sites,
    isLoading: isSitesLoading,
    error: sitesError,
    refresh: refreshSites
  } = useWarehouseSites();

  const {
    drilldown,
    isLoading: isDrilldownLoading,
    error: drilldownError,
    refresh: refreshDrilldown
  } = useWarehouseDrilldown({
    siteScope,
    warehouseCode: warehouseCode || undefined
  });

  const filteredSites = useMemo(() => {
    if (siteScope === 'all') {
      return sites;
    }

    return sites.filter((site) => site.siteType === siteScope);
  }, [sites, siteScope]);

  const selectedSite = useMemo(() => {
    if (!warehouseCode) {
      return null;
    }

    return sites.find((site) => site.siteCode === warehouseCode) ?? null;
  }, [sites, warehouseCode]);

  const activeBase = summary.activeLocations > 0 ? summary.activeLocations : summary.totalLocations;

  async function handleRefresh() {
    await Promise.all([refresh(), refreshSites(), refreshDrilldown()]);
  }

  function handleSiteScopeChange(nextScope: WarehouseSiteScope) {
    setSiteScope(nextScope);
    setWarehouseCode('');
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
              Warehouse
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Warehouse overview now uses normalized site selection and utilization drill-down by location type and zone.
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
              onClick={() => void handleRefresh()}
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
          Filter utilization by normalized site scope and site selection so each warehouse or outlet can be measured on its own.
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
              onChange={(e) => handleSiteScopeChange(e.target.value as WarehouseSiteScope)}
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
              Site
            </label>
            <select
              value={warehouseCode}
              onChange={(e) => setWarehouseCode(e.target.value)}
              disabled={isSitesLoading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="">
                {isSitesLoading ? 'Loading sites...' : 'All sites'}
              </option>

              {filteredSites.map((site) => (
                <option key={site.siteCode} value={site.siteCode}>
                  {site.siteCode} â€” {site.siteName}
                </option>
              ))}
            </select>

            <div style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
              Choose a normalized site from the master list instead of typing a code manually.
            </div>

            {sitesError ? (
              <div style={{ marginTop: '8px', color: '#b91c1c', fontSize: '13px' }}>
                {sitesError}
              </div>
            ) : null}
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
          {selectedSite
            ? ` â€¢ ${selectedSite.siteCode} â€” ${selectedSite.siteName}`
            : ' â€¢ all sites'}
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

          <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
            {isDrilldownLoading ? (
              <div style={{ color: '#64748b' }}>Loading utilization drill-down...</div>
            ) : drilldownError ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca'
                }}
              >
                {drilldownError}
              </div>
            ) : (
              <>
                <DrilldownTable
                  title="Utilization by Location Type"
                  description="Breakdown of location capacity and fullness by location type for the current site filter."
                  rows={drilldown.byLocationType}
                />

                <DrilldownTable
                  title="Utilization by Zone"
                  description="Breakdown of location capacity and fullness by zone for the current site filter."
                  rows={drilldown.byZone}
                />
              </>
            )}
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
              This summary now includes drill-down by location type and zone for the selected normalized site and scope.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
