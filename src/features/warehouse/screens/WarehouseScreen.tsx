'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useWarehouseAlertThresholds } from '../hooks/useWarehouseAlertThresholds';
import { useWarehouseAlerts } from '../hooks/useWarehouseAlerts';
import { useWarehouseDrilldown } from '../hooks/useWarehouseDrilldown';
import { useWarehouseSites } from '../hooks/useWarehouseSites';
import { useWarehouseSummary } from '../hooks/useWarehouseSummary';
import type {
  WarehouseAlertThresholdRecord,
  WarehouseLocationAlertRecord,
  WarehouseSiteScope,
  WarehouseUtilizationDrilldownBucket
} from '../types';

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

function getAlertSeverityStyle(severity: WarehouseLocationAlertRecord['severity']) {
  if (severity === 'full') {
    return {
      background: '#fee2e2',
      color: '#1D4ED8',
      border: '1px solid #fecaca'
    };
  }

  return {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a'
  };
}

function getAlertSeverityLabel(severity: WarehouseLocationAlertRecord['severity']) {
  return severity === 'full' ? 'Full' : 'Near Full';
}

function getThresholdSourceLabel(source: string) {
  if (source === 'site_override') {
    return 'site override';
  }

  if (source === 'site_type_default') {
    return 'site type default';
  }

  if (source === 'request_override') {
    return 'request override';
  }

  return 'global default';
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

function ThresholdConfigTable({
  rows,
  drafts,
  isSaving,
  onDraftChange,
  onSave,
  onClear
}: {
  rows: WarehouseAlertThresholdRecord[];
  drafts: Record<string, string>;
  isSaving: boolean;
  onDraftChange: (siteCode: string, value: string) => void;
  onSave: (siteCode: string) => Promise<void>;
  onClear: (siteCode: string) => Promise<void>;
}) {
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
      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Alert Threshold Configuration
      </div>
      <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
        Configure near-full thresholds per site. Full locations always remain at 100%.
      </div>

      {rows.length === 0 ? (
        <div style={{ color: '#64748b' }}>No threshold configuration rows found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Site</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Current Threshold</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Source</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>New Threshold %</th>
                <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const siteCode = row.siteCode ?? '';
                const currentDraft = drafts[siteCode] ?? String(row.thresholdPct);

                return (
                  <tr key={`${row.siteCode ?? 'all'}-${row.siteType}`}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{row.siteCode ?? 'ALL SITES'}</div>
                      <div>{row.siteName}</div>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.siteType}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {formatPercent(row.thresholdPct)}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {getThresholdSourceLabel(row.source)}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <input
                        value={currentDraft}
                        onChange={(e) => onDraftChange(siteCode, e.target.value)}
                        disabled={isSaving || !siteCode}
                        placeholder="80"
                        style={{
                          width: '120px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1'
                        }}
                      />
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          disabled={isSaving || !siteCode}
                          onClick={() => void onSave(siteCode)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isSaving || !siteCode ? '#94a3b8' : '#0f172a',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: isSaving || !siteCode ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          disabled={isSaving || !siteCode || row.source !== 'site_override'}
                          onClick={() => void onClear(siteCode)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: isSaving || !siteCode || row.source !== 'site_override' ? '#94a3b8' : '#334155',
                            fontWeight: 600,
                            cursor: isSaving || !siteCode || row.source !== 'site_override' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Clear Override
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
    items: thresholdItems,
    isLoading: isThresholdsLoading,
    isSaving: isThresholdSaving,
    error: thresholdsError,
    refresh: refreshThresholds,
    updateThreshold,
    clearThreshold
  } = useWarehouseAlertThresholds();

  const {
    drilldown,
    isLoading: isDrilldownLoading,
    error: drilldownError,
    refresh: refreshDrilldown
  } = useWarehouseDrilldown({
    siteScope,
    warehouseCode: warehouseCode || undefined
  });

  const {
    alerts,
    isLoading: isAlertsLoading,
    error: alertsError,
    refresh: refreshAlerts
  } = useWarehouseAlerts({
    siteScope,
    warehouseCode: warehouseCode || undefined
  });

  const [thresholdDrafts, setThresholdDrafts] = useState<Record<string, string>>({});

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

  const visibleThresholdItems = useMemo(() => {
    let filtered = thresholdItems;

    if (siteScope !== 'all') {
      filtered = filtered.filter((item) => item.siteType === siteScope);
    }

    if (warehouseCode) {
      filtered = filtered.filter((item) => item.siteCode === warehouseCode);
    }

    return filtered;
  }, [thresholdItems, siteScope, warehouseCode]);

  const activeBase = summary.activeLocations > 0 ? summary.activeLocations : summary.totalLocations;

  async function handleRefresh() {
    await Promise.all([
      refresh(),
      refreshSites(),
      refreshDrilldown(),
      refreshAlerts(),
      refreshThresholds()
    ]);
  }

  function handleSiteScopeChange(nextScope: WarehouseSiteScope) {
    setSiteScope(nextScope);
    setWarehouseCode('');
  }

  function handleThresholdDraftChange(siteCode: string, value: string) {
    setThresholdDrafts((current) => ({
      ...current,
      [siteCode]: value
    }));
  }

  async function handleSaveThreshold(siteCode: string) {
    const rawValue = thresholdDrafts[siteCode];
    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    await updateThreshold(siteCode, parsedValue);
    await Promise.all([refreshAlerts(), refreshThresholds()]);
  }

  async function handleClearThreshold(siteCode: string) {
    await clearThreshold(siteCode);
    await Promise.all([refreshAlerts(), refreshThresholds()]);
    setThresholdDrafts((current) => {
      const next = { ...current };
      delete next[siteCode];
      return next;
    });
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
              Warehouse overview brings together normalized site filters, clear utilization signals, and actionable capacity alerts in a calm enterprise workspace.
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
          Filter by site scope and selected site to review each warehouse or outlet with clearer, eye-friendly operational visibility.
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
            background: '#EFF6FF',
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

          <ThresholdConfigTable
            rows={visibleThresholdItems}
            drafts={thresholdDrafts}
            isSaving={isThresholdSaving}
            onDraftChange={handleThresholdDraftChange}
            onSave={handleSaveThreshold}
            onClear={handleClearThreshold}
          />

          {isThresholdsLoading ? (
            <div style={{ color: '#64748b', marginBottom: '24px' }}>Loading threshold configuration...</div>
          ) : thresholdsError ? (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: '#EFF6FF',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                marginBottom: '24px'
              }}
            >
              {thresholdsError}
            </div>
          ) : null}

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
              Location Capacity Alerts
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
              Near-full and full locations help operations act before capacity becomes a bottleneck.
            </div>

            {isAlertsLoading ? (
              <div style={{ color: '#64748b' }}>Loading warehouse alerts...</div>
            ) : alertsError ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  color: '#b91c1c',
                  border: '1px solid #fecaca'
                }}
              >
                {alertsError}
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ color: '#0F766E', marginBottom: '8px' }}>Near-Full Locations</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F766E' }}>{alerts.nearFullLocations}</div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ color: '#1D4ED8', marginBottom: '8px' }}>Full Locations</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1D4ED8' }}>{alerts.fullLocations}</div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Alert Locations</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>{alerts.totalAlertLocations}</div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>Requested Threshold</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPercent(alerts.thresholdPct)}</div>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>Applied Thresholds</div>
                  {alerts.appliedThresholds.length === 0 ? (
                    <div style={{ color: '#64748b' }}>No threshold metadata returned.</div>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {alerts.appliedThresholds.map((item) => (
                        <div key={`${item.siteCode ?? 'all'}-${item.siteType}`}>
                          <strong>{item.siteCode ?? 'ALL SITES'}</strong> â€” {item.siteName} â€” {item.siteType} â€” {formatPercent(item.thresholdPct)} ({getThresholdSourceLabel(item.source)})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {alerts.items.length === 0 ? (
                  <div style={{ color: '#64748b' }}>No near-full or full locations found for the current filter.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Severity</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Site</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Zone / Type</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Utilization</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Threshold</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Remaining</th>
                          <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.items.map((item) => (
                          <tr key={`${item.id}-${item.severity}`}>
                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '6px 10px',
                                  borderRadius: '999px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  ...getAlertSeverityStyle(item.severity)
                                }}
                              >
                                {getAlertSeverityLabel(item.severity)}
                              </span>
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              <div style={{ fontWeight: 700 }}>{item.siteCode}</div>
                              <div>{item.siteName}</div>
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                              {item.locationCode}
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              <div>{item.zone}</div>
                              <div style={{ color: '#64748b', fontSize: '13px' }}>{item.locationType}</div>
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              <div style={{ fontWeight: 700 }}>{formatPercent(item.utilizationPct)}</div>
                              <div style={{ color: '#64748b', fontSize: '13px' }}>
                                {item.capacityUsed} / {item.capacityTotal} {item.capacityUom}
                              </div>
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              {formatPercent(item.thresholdPctApplied)}
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              {item.remainingCapacity} {item.capacityUom}
                            </td>

                            <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                              {item.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
            {isDrilldownLoading ? (
              <div style={{ color: '#64748b' }}>Loading utilization drill-down...</div>
            ) : drilldownError ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
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
              This overview combines calmer visual hierarchy, configurable thresholds, actionable alerts, and drill-down by location type and zone for the selected site.
            </div>
          </div>
        </>
      )}
    </div>
  );
}


