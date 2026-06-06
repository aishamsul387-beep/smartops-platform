'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { PageHeaderCard, PageSectionCard, PageStatCard, PageStatsGrid } from '@/components/layout/PageShell';
import { useCreateWarehouseLocation } from '../hooks/useCreateWarehouseLocation';
import { useToggleWarehouseLocationActive } from '../hooks/useToggleWarehouseLocationActive';
import { useWarehouseLocations } from '../hooks/useWarehouseLocations';
import { useWarehouseSites } from '../hooks/useWarehouseSites';
import { useWarehouseSummary } from '../hooks/useWarehouseSummary';
import {
  initialWarehouseLocationFormValues,
  mapWarehouseLocationFormToCreateRequest,
  validateWarehouseLocationForm
} from '../schema';
import { warehouseApi } from '../api';
import type {
  WarehouseLocationFormErrors,
  WarehouseLocationFormValues,
  WarehouseLocationImportResult,
  WarehouseLocationRecord,
  WarehouseSiteScope
} from '../types';

function getStatusStyle(status: string) {
  if (status === 'empty') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'occupied') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    };
  }

  return {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  };
}

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadTextFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildWarehouseLocationTemplateCsv() {
  const header = [
    'warehouseCode',
    'warehouseName',
    'locationCode',
    'zone',
    'aisle',
    'levelCode',
    'bin',
    'locationType',
    'status',
    'capacityUom',
    'palletCapacity',
    'usedPalletCapacity',
    'cubicCapacityM3',
    'usedCubicCapacityM3',
    'isActive',
    'notes'
  ];

  const sampleRows = [
    [
      'WH-001',
      'Main Warehouse',
      'A-01-01-01',
      'A',
      '01',
      '01',
      '01',
      'rack',
      'empty',
      'pallet',
      '4',
      '0',
      '12',
      '0',
      'true',
      'Sample rack location'
    ],
    [
      'OTL-001',
      'Outlet 1',
      'SH-01-01-01',
      'SH',
      '01',
      '01',
      '01',
      'shelves',
      'occupied',
      'pcs',
      '120',
      '48',
      '6',
      '2',
      'true',
      'Sample outlet shelf using pcs capacity'
    ],
    [
      'OTL-001',
      'Outlet 1',
      'BF-01-01-01',
      'BF',
      '01',
      '01',
      '01',
      'floor',
      'empty',
      'carton',
      '24',
      '6',
      '10',
      '2',
      'true',
      'Sample outlet buffer stock using carton capacity'
    ]
  ];

  return [header.join(','), ...sampleRows.map((row) => row.map(csvEscape).join(','))].join('\n');
}

function buildWarehouseLocationExportCsv(items: WarehouseLocationRecord[]) {
  const header = [
    'warehouseCode',
    'warehouseName',
    'locationCode',
    'zone',
    'aisle',
    'levelCode',
    'bin',
    'locationType',
    'status',
    'capacityUom',
    'palletCapacity',
    'usedPalletCapacity',
    'cubicCapacityM3',
    'usedCubicCapacityM3',
    'isActive',
    'notes'
  ];

  const rows = items.map((item) =>
    [
      item.warehouseCode,
      item.warehouseName,
      item.locationCode,
      item.zone,
      item.aisle,
      item.levelCode,
      item.bin,
      item.locationType,
      item.status,
      item.capacityUom,
      item.palletCapacity,
      item.usedPalletCapacity,
      item.cubicCapacityM3,
      item.usedCubicCapacityM3,
      item.isActive,
      item.notes
    ]
      .map(csvEscape)
      .join(',')
  );

  return [header.join(','), ...rows].join('\n');
}

function getCapacityUnitLabel(capacityUom: WarehouseLocationRecord['capacityUom']) {
  if (capacityUom === 'pcs') {
    return 'PCS';
  }

  if (capacityUom === 'carton') {
    return 'Carton';
  }

  return 'Pallet';
}

function getStorageCapacityLabel(capacityUom: WarehouseLocationFormValues['capacityUom']) {
  if (capacityUom === 'pcs') {
    return 'Storage Capacity (PCS)';
  }

  if (capacityUom === 'carton') {
    return 'Storage Capacity (Carton)';
  }

  return 'Storage Capacity (Pallet)';
}

function getUsedStorageCapacityLabel(capacityUom: WarehouseLocationFormValues['capacityUom']) {
  if (capacityUom === 'pcs') {
    return 'Used Storage Capacity (PCS)';
  }

  if (capacityUom === 'carton') {
    return 'Used Storage Capacity (Carton)';
  }

  return 'Used Storage Capacity (Pallet)';
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function WarehouseLocationMasterScreen() {
  const {
    items,
    total,
    filters,
    isLoading,
    error,
    updateSearch,
    updateWarehouseCode,
    updateSiteScope,
    updateLocationCode,
    updateStatus,
    updateType,
    updateActive,
    refresh
  } = useWarehouseLocations();

  const {
    items: sites,
    isLoading: isSitesLoading,
    error: sitesError,
    refresh: refreshSites
  } = useWarehouseSites();

  const {
    summary: utilizationSummary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refresh: refreshSummary
  } = useWarehouseSummary({
    search: filters.search,
    warehouseCode: filters.warehouseCode,
    siteScope: filters.siteScope,
    locationCode: filters.locationCode,
    status: filters.status,
    type: filters.type,
    active: filters.active
  });

  const { createLocation, isSubmitting, error: createError } = useCreateWarehouseLocation();
  const { toggleActive, isSubmitting: isToggling, error: toggleError } = useToggleWarehouseLocationActive();

  const [values, setValues] = useState<WarehouseLocationFormValues>(initialWarehouseLocationFormValues);
  const [errors, setErrors] = useState<WarehouseLocationFormErrors>({});

  const [csvText, setCsvText] = useState('');
  const [pendingCsvText, setPendingCsvText] = useState('');
  const [selectedCsvFileName, setSelectedCsvFileName] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [importResult, setImportResult] = useState<WarehouseLocationImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const filteredSites = useMemo(() => {
    const currentScope = filters.siteScope ?? 'all';

    if (currentScope === 'all') {
      return sites;
    }

    return sites.filter((site) => site.siteType === currentScope);
  }, [sites, filters.siteScope]);

  const selectedSite = useMemo(() => {
    if (!filters.warehouseCode) {
      return null;
    }

    return sites.find((site) => site.siteCode === filters.warehouseCode) ?? null;
  }, [sites, filters.warehouseCode]);

  const locationSummary = useMemo(() => {
    const activeItems = items.filter((item) => item.isActive).length;
    const emptyItems = items.filter((item) => item.status === 'empty').length;
    const occupiedItems = items.filter((item) => item.status === 'occupied').length;
    const blockedItems = items.filter((item) => item.status === 'blocked').length;

    return {
      activeItems,
      emptyItems,
      occupiedItems,
      blockedItems
    };
  }, [items]);

  async function refreshAll() {
    await Promise.all([refresh(), refreshSummary(), refreshSites()]);
  }

  function handleSiteScopeChange(siteScope: WarehouseSiteScope) {
    updateSiteScope(siteScope);
  }

  function updateField<K extends keyof WarehouseLocationFormValues>(
    field: K,
    value: WarehouseLocationFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateWarehouseLocationForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      await createLocation(mapWarehouseLocationFormToCreateRequest(values));
      setValues(initialWarehouseLocationFormValues);
      await refreshAll();
    } catch {
      // hook error shown on screen
    }
  }

  async function handleToggle(item: WarehouseLocationRecord) {
    try {
      await toggleActive(item.id, !item.isActive);
      await refreshAll();
    } catch {
      // hook error shown on screen
    }
  }

  function handleCsvFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedCsvFileName(null);
      setPendingCsvText('');
      return;
    }

    setSelectedCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPendingCsvText(String(reader.result ?? ''));
    };
    reader.readAsText(file);
  }

  function handleConfirmAttachedFile() {
    setCsvText(pendingCsvText);
    setImportResult(null);
    setImportError(null);
  }

  function handleRemoveAttachedFile() {
    setSelectedCsvFileName(null);
    setPendingCsvText('');
    setCsvText('');
    setFileInputKey((current) => current + 1);
    setImportResult(null);
    setImportError(null);
  }

  async function handleImportCsv() {
    try {
      setIsImporting(true);
      setImportError(null);
      const result = await warehouseApi.importLocationsCsv(csvText);
      setImportResult(result);
      await refreshAll();
    } catch (err: any) {
      setImportResult(null);
      setImportError(err?.message || 'Failed to import CSV');
    } finally {
      setIsImporting(false);
    }
  }

  async function handleExportCsv() {
    try {
      setIsExporting(true);
      const csv = buildWarehouseLocationExportCsv(items);
      downloadTextFile(csv, 'warehouse-locations.csv', 'text/csv;charset=utf-8;');
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      setIsDownloadingTemplate(true);
      const csv = buildWarehouseLocationTemplateCsv();
      downloadTextFile(csv, 'warehouse-locations-template.csv', 'text/csv;charset=utf-8;');
    } finally {
      setIsDownloadingTemplate(false);
    }
  }

  return (
    <div className="container">
      <PageHeaderCard
        title="Warehouse Location Master"
        description="Master location setup for storage, inventory control, receiving, and future capacity analytics."
        actions={
          <>
            <button
              type="button"
              onClick={() => void refreshAll()}
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

            <button
              type="button"
              onClick={() => void handleDownloadTemplate()}
              disabled={isDownloadingTemplate}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: isDownloadingTemplate ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {isDownloadingTemplate ? 'Preparing...' : 'Download CSV Template'}
            </button>

            <button
              type="button"
              onClick={() => void handleExportCsv()}
              disabled={isExporting}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isExporting ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </>
        }
      />

      <PageSectionCard
        title="Warehouse Utilization Summary"
        description="This summary follows your current normalized site and location filters."
      >
        {isSummaryLoading ? (
          <div style={{ color: '#64748b' }}>Loading warehouse utilization summary...</div>
        ) : summaryError ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca'
            }}
          >
            {summaryError}
          </div>
        ) : (
          <>
            <PageStatsGrid>
              <PageStatCard
                label="Pallet Utilization"
                value={formatPercent(utilizationSummary.palletUtilizationPct)}
              />
              <PageStatCard
                label="PCS Utilization"
                value={formatPercent(utilizationSummary.pcsUtilizationPct)}
              />
              <PageStatCard
                label="Carton Utilization"
                value={formatPercent(utilizationSummary.cartonUtilizationPct)}
              />
              <PageStatCard label="Total Locations" value={utilizationSummary.totalLocations} />
              <PageStatCard label="Active Locations" value={utilizationSummary.activeLocations} />
              <PageStatCard label="Inactive Locations" value={utilizationSummary.inactiveLocations} />
            </PageStatsGrid>

            <div
              style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}
            >
              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155'
                }}
              >
                <strong>Pallet basis:</strong> {utilizationSummary.palletCapacityUsed} / {utilizationSummary.palletCapacityTotal}
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155'
                }}
              >
                <strong>PCS basis:</strong> {utilizationSummary.pcsCapacityUsed} / {utilizationSummary.pcsCapacityTotal}
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155'
                }}
              >
                <strong>Carton basis:</strong> {utilizationSummary.cartonCapacityUsed} / {utilizationSummary.cartonCapacityTotal}
              </div>
            </div>
          </>
        )}
      </PageSectionCard>

      <PageSectionCard
        title="Import Warehouse Locations CSV"
        description="Upload or paste CSV content to create/update location master records in bulk."
      >
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Upload CSV File
            </label>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                key={fileInputKey}
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvFileChange}
              />

              <button
                type="button"
                onClick={handleConfirmAttachedFile}
                disabled={!pendingCsvText.trim()}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !pendingCsvText.trim() ? '#94a3b8' : '#0f172a',
                  color: '#ffffff',
                  cursor: !pendingCsvText.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                Confirm Attached File
              </button>

              <button
                type="button"
                onClick={handleRemoveAttachedFile}
                disabled={!selectedCsvFileName}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: !selectedCsvFileName ? '#94a3b8' : '#334155',
                  cursor: !selectedCsvFileName ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                Remove File
              </button>
            </div>

            {selectedCsvFileName ? (
              <div style={{ marginTop: '8px', color: '#475569', fontSize: '14px' }}>
                Attached file: <strong>{selectedCsvFileName}</strong>
              </div>
            ) : null}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              CSV Content
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              placeholder="warehouseCode,warehouseName,locationCode,zone,aisle,levelCode,bin,locationType,status,capacityUom,palletCapacity,usedPalletCapacity,cubicCapacityM3,usedCubicCapacityM3,isActive,notes"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => void handleImportCsv()}
              disabled={isImporting || !csvText.trim()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isImporting || !csvText.trim() ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                cursor: isImporting || !csvText.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {isImporting ? 'Importing...' : 'Import CSV'}
            </button>
          </div>

          {importError ? (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {importError}
            </div>
          ) : null}

          {importResult ? (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155'
              }}
            >
              <div><strong>Inserted:</strong> {importResult.inserted}</div>
              <div><strong>Updated:</strong> {importResult.updated}</div>
              <div><strong>Skipped:</strong> {importResult.skipped}</div>
              {importResult.errors.length > 0 ? (
                <div style={{ marginTop: '8px', color: '#b91c1c' }}>
                  {importResult.errors.map((error, index) => (
                    <div key={index}>
                      Row {error.rowNumber}: {error.message}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </PageSectionCard>

      <PageSectionCard title="Create Warehouse Location">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Code</label>
              <input value={values.warehouseCode} onChange={(e) => updateField('warehouseCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.warehouseCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Warehouse Name</label>
              <input value={values.warehouseName} onChange={(e) => updateField('warehouseName', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.warehouseName ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.warehouseName}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location Code</label>
              <input value={values.locationCode} onChange={(e) => updateField('locationCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.locationCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.locationCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zone</label>
              <input value={values.zone} onChange={(e) => updateField('zone', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.zone ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.zone}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Aisle</label>
              <input value={values.aisle} onChange={(e) => updateField('aisle', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.aisle ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.aisle}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Level</label>
              <input value={values.levelCode} onChange={(e) => updateField('levelCode', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.levelCode ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.levelCode}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bin</label>
              <input value={values.bin} onChange={(e) => updateField('bin', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.bin ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.bin}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location Type</label>
              <select value={values.locationType} onChange={(e) => updateField('locationType', e.target.value as WarehouseLocationFormValues['locationType'])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="rack">rack</option>
                <option value="floor">floor</option>
                <option value="bulk">bulk</option>
                <option value="staging">staging</option>
                <option value="quarantine">quarantine</option>
                <option value="shelves">shelves</option>
                <option value="island">island</option>
              </select>
              {errors.locationType ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.locationType}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
              <select value={values.status} onChange={(e) => updateField('status', e.target.value as WarehouseLocationFormValues['status'])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="empty">empty</option>
                <option value="occupied">occupied</option>
                <option value="blocked">blocked</option>
              </select>
              {errors.status ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.status}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Capacity Unit</label>
              <select value={values.capacityUom} onChange={(e) => updateField('capacityUom', e.target.value as WarehouseLocationFormValues['capacityUom'])} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="pallet">pallet</option>
                <option value="pcs">pcs</option>
                <option value="carton">carton</option>
              </select>
              <div style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                Use <strong>pcs</strong> for outlet shelves, and <strong>carton</strong> for outlet buffer stock.
              </div>
              {errors.capacityUom ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.capacityUom}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{getStorageCapacityLabel(values.capacityUom)}</label>
              <input value={values.palletCapacity} onChange={(e) => updateField('palletCapacity', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.palletCapacity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.palletCapacity}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{getUsedStorageCapacityLabel(values.capacityUom)}</label>
              <input value={values.usedPalletCapacity} onChange={(e) => updateField('usedPalletCapacity', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.usedPalletCapacity ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.usedPalletCapacity}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Cubic Capacity (m3)</label>
              <input value={values.cubicCapacityM3} onChange={(e) => updateField('cubicCapacityM3', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.cubicCapacityM3 ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.cubicCapacityM3}</div> : null}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Used Cubic Capacity (m3)</label>
              <input value={values.usedCubicCapacityM3} onChange={(e) => updateField('usedCubicCapacityM3', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              {errors.usedCubicCapacityM3 ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.usedCubicCapacityM3}</div> : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '28px' }}>
              <input
                id="isActive"
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              <label htmlFor="isActive" style={{ fontWeight: 600 }}>Active</label>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Notes</label>
              <textarea value={values.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
              {errors.notes ? <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{errors.notes}</div> : null}
            </div>
          </div>

          {(createError || toggleError) ? (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {createError || toggleError}
            </div>
          ) : null}

          <div style={{ marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isSubmitting ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Location'}
            </button>
          </div>
        </form>
      </PageSectionCard>

      <PageSectionCard title="Warehouse Location Summary">
        <PageStatsGrid>
          <PageStatCard label="Total Locations" value={total} />
          <PageStatCard label="Active Locations" value={locationSummary.activeItems} />
          <PageStatCard label="Empty Locations" value={locationSummary.emptyItems} />
          <PageStatCard label="Occupied Locations" value={locationSummary.occupiedItems} />
          <PageStatCard label="Blocked Locations" value={locationSummary.blockedItems} />
        </PageStatsGrid>
      </PageSectionCard>

      <PageSectionCard title="Search & Filter">
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
              value={filters.siteScope || 'all'}
              onChange={(e) => handleSiteScopeChange(e.target.value as WarehouseSiteScope)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">all</option>
              <option value="warehouse">warehouse</option>
              <option value="outlet">outlet</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Site</label>
            <select
              value={filters.warehouseCode || ''}
              onChange={(e) => updateWarehouseCode(e.target.value)}
              disabled={isSitesLoading}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="">{isSitesLoading ? 'Loading sites...' : 'All sites'}</option>
              {filteredSites.map((site) => (
                <option key={site.siteCode} value={site.siteCode}>
                  {site.siteCode} â€” {site.siteName}
                </option>
              ))}
            </select>
            {sitesError ? (
              <div style={{ marginTop: '8px', color: '#b91c1c', fontSize: '13px' }}>{sitesError}</div>
            ) : selectedSite ? (
              <div style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                Selected: {selectedSite.siteCode} â€” {selectedSite.siteName}
              </div>
            ) : null}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input
              value={filters.search || ''}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search location, zone, aisle, warehouse"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location Code</label>
            <input
              value={filters.locationCode || ''}
              onChange={(e) => updateLocationCode(e.target.value)}
              placeholder="Filter by exact/partial location code"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => updateStatus(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="empty">empty</option>
              <option value="occupied">occupied</option>
              <option value="blocked">blocked</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type</label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => updateType(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="rack">rack</option>
              <option value="floor">floor</option>
              <option value="bulk">bulk</option>
              <option value="staging">staging</option>
              <option value="quarantine">quarantine</option>
              <option value="shelves">shelves</option>
              <option value="island">island</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Active</label>
            <select
              value={filters.active || 'all'}
              onChange={(e) => updateActive(e.target.value as any)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
        </div>
      </PageSectionCard>

      <PageSectionCard title="Warehouse Location List" noPadding>
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading warehouse locations...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No warehouse locations found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Warehouse</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location Code</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Zone / Aisle / Level / Bin</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Storage Capacity</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Active</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{item.warehouseCode}</div>
                      <div>{item.warehouseName}</div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.locationCode}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.zone} / {item.aisle} / {item.levelCode} / {item.bin}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.locationType}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          ...getStatusStyle(item.status)
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div>
                        {getCapacityUnitLabel(item.capacityUom)}: {item.usedPalletCapacity} / {item.palletCapacity}
                      </div>
                      <div>M3: {item.usedCubicCapacityM3} / {item.cubicCapacityM3}</div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.isActive ? 'Yes' : 'No'}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => void handleToggle(item)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontWeight: 600
                        }}
                      >
                        {item.isActive ? 'Set inactive' : 'Set active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageSectionCard>
    </div>
  );
}
