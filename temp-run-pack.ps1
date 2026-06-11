$ErrorActionPreference = "Stop"

# =========================
# PATHS
# =========================
$FE = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-platform"
$BE = "C:\Users\HP\OneDrive\Desktop\SmartOpsAI\mobile-app\smartops-supply-web\backend"

$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$FEBackup = Join-Path $FE "temp-pack-backups\h11b_easy_$Stamp\frontend"
$BEBackup = Join-Path $BE "temp-pack-backups\h11b_easy_$Stamp\backend"

function Ensure-Dir([string]$PathValue) {
  if (-not [string]::IsNullOrWhiteSpace($PathValue)) {
    New-Item -ItemType Directory -Force -Path $PathValue | Out-Null
  }
}

function Backup-RepoFile([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath) {
  $SourcePath = Join-Path $RepoRoot $RelativePath
  if (Test-Path -LiteralPath $SourcePath) {
    $BackupPath = Join-Path $BackupRoot $RelativePath
    Ensure-Dir (Split-Path $BackupPath -Parent)
    Copy-Item -LiteralPath $SourcePath -Destination $BackupPath -Force
  }
}

function Write-RepoFile([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath, [string]$Content) {
  Backup-RepoFile $RepoRoot $BackupRoot $RelativePath
  $DestinationPath = Join-Path $RepoRoot $RelativePath
  Ensure-Dir (Split-Path $DestinationPath -Parent)
  Set-Content -LiteralPath $DestinationPath -Value $Content -Encoding UTF8
  Write-Host "Wrote: $DestinationPath" -ForegroundColor Green
}

Write-Host "=== H11-B EASY SANDBOX GENERATOR ===" -ForegroundColor Cyan
Write-Host "Frontend: $FE" -ForegroundColor Cyan
Write-Host "Backend : $BE" -ForegroundColor Yellow

# =========================
# FRONTEND FILES
# =========================

$fe_page_main = @'
import { StockIssueH11BScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BScreen';

export default function StockIssuesH11BPage() {
  return <StockIssueH11BScreen />;
}
'@

$fe_page_history = @'
import { StockIssueH11BHistoryScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BHistoryScreen';

export default function StockIssuesH11BHistoryPage() {
  return <StockIssueH11BHistoryScreen />;
}
'@

$fe_page_detail = @'
import { StockIssueH11BDetailScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BDetailScreen';

export default function StockIssuesH11BDetailPage({
  params,
}: {
  params: { issueId: string };
}) {
  return <StockIssueH11BDetailScreen issueId={params.issueId} />;
}
'@

$fe_page_print = @'
import { StockIssueH11BPrintScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BPrintScreen';

export default function StockIssuesH11BPrintPage({
  params,
}: {
  params: { issueId: string };
}) {
  return <StockIssueH11BPrintScreen issueId={params.issueId} />;
}
'@

$fe_types = @'
export type H11BReasonCode =
  | 'PRODUCTION_USE'
  | 'INTERNAL_USE'
  | 'DAMAGE'
  | 'QUALITY_REJECT'
  | 'SAMPLE'
  | 'EXPIRY_DISPOSAL'
  | 'MANUAL_CONSUMPTION';

export interface H11BReasonOption {
  code: H11BReasonCode;
  label: string;
  active: boolean;
}

export interface H11BWarehouseOption {
  code: string;
  name: string;
  active: boolean;
}

export interface H11BLocationOption {
  code: string;
  name: string;
  warehouseCode: string;
  active: boolean;
}

export interface H11BContextResponse {
  reasonCodes: H11BReasonOption[];
  warehouses: H11BWarehouseOption[];
  locations: H11BLocationOption[];
}

export interface H11BPreviewRequest {
  inventoryItemId: string;
  productName: string;
  sku?: string | null;
  barcode?: string | null;
  requestedQty: number;
  reasonCode: H11BReasonCode;
  warehouseCode?: string | null;
  locationCode?: string | null;
  remarks?: string | null;
}

export interface H11BAllocation {
  batchId: string;
  batchNumber: string;
  expiryDate: string | null;
  allocatedQty: number;
  availableQty: number;
}

export interface H11BPreviewResponse {
  canFulfill: boolean;
  requestedQty: number;
  totalAllocatableQty: number;
  shortageQty: number;
  allocations: H11BAllocation[];
  validation: string[];
}

export interface H11BIssueRecord {
  id: string;
  issueNumber: string;
  status: 'POSTED';
  inventoryItemId: string;
  productName: string;
  sku?: string | null;
  barcode?: string | null;
  requestedQty: number;
  issuedQty: number;
  reasonCode: H11BReasonCode;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  locationCode?: string | null;
  locationName?: string | null;
  remarks?: string | null;
  actorName?: string | null;
  createdAt: string;
  updatedAt: string;
  allocations: H11BAllocation[];
  movementRefs: string[];
}

export interface H11BIssueListResponse {
  items: H11BIssueRecord[];
  total: number;
}
'@

$fe_api = @'
import {
  H11BContextResponse,
  H11BIssueListResponse,
  H11BIssueRecord,
  H11BPreviewRequest,
  H11BPreviewResponse,
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  }

  return data as T;
}

export function getH11BContext() {
  return apiRequest<H11BContextResponse>('/stock-control/issues-h11b/context');
}

export function previewH11BIssue(payload: H11BPreviewRequest) {
  return apiRequest<H11BPreviewResponse>('/stock-control/issues-h11b/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createH11BIssue(payload: H11BPreviewRequest) {
  return apiRequest<{ issue: H11BIssueRecord }>('/stock-control/issues-h11b', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listH11BIssues(q = '') {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return apiRequest<H11BIssueListResponse>(`/stock-control/issues-h11b${query}`);
}

export function getH11BIssue(issueId: string) {
  return apiRequest<{ issue: H11BIssueRecord }>(`/stock-control/issues-h11b/${issueId}`);
}

export function getH11BPrint(issueId: string) {
  return apiRequest<{ issue: H11BIssueRecord }>(`/stock-control/issues-h11b/${issueId}/print`);
}
'@

$fe_hook_context = @'
'use client';

import { useEffect, useState } from 'react';
import { getH11BContext } from '../api';
import { H11BContextResponse } from '../types';

const emptyContext: H11BContextResponse = {
  reasonCodes: [],
  warehouses: [],
  locations: [],
};

export function useStockIssueH11BContext() {
  const [data, setData] = useState<H11BContextResponse>(emptyContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError('');
        const response = await getH11BContext();
        if (active) setData(response);
      } catch (err: any) {
        if (active) setError(err?.message || 'Failed to load issue context');
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}
'@

$fe_hook_form = @'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createH11BIssue, previewH11BIssue } from '../api';
import { H11BPreviewResponse, H11BReasonCode } from '../types';

export interface H11BFormState {
  inventoryItemId: string;
  productName: string;
  sku: string;
  barcode: string;
  requestedQty: number;
  reasonCode: H11BReasonCode | '';
  warehouseCode: string;
  locationCode: string;
  remarks: string;
}

const defaultState: H11BFormState = {
  inventoryItemId: '',
  productName: '',
  sku: '',
  barcode: '',
  requestedQty: 1,
  reasonCode: '',
  warehouseCode: '',
  locationCode: '',
  remarks: '',
};

export function useStockIssueH11BForm() {
  const router = useRouter();
  const [form, setForm] = useState<H11BFormState>(defaultState);
  const [preview, setPreview] = useState<H11BPreviewResponse | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField<K extends keyof H11BFormState>(key: K, value: H11BFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.inventoryItemId.trim()) return 'Inventory Item ID is required';
    if (!form.productName.trim()) return 'Product Name is required';
    if (!form.requestedQty || form.requestedQty <= 0) return 'Requested Qty must be greater than 0';
    if (!form.reasonCode) return 'Reason Code is required';
    if (!form.warehouseCode.trim()) return 'Warehouse is required';
    if (!form.locationCode.trim()) return 'Location is required';
    return '';
  }

  async function doPreview() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoadingPreview(true);
      setError('');
      setSuccess('');
      const result = await previewH11BIssue({
        inventoryItemId: form.inventoryItemId,
        productName: form.productName,
        sku: form.sku || null,
        barcode: form.barcode || null,
        requestedQty: Number(form.requestedQty),
        reasonCode: form.reasonCode as H11BReasonCode,
        warehouseCode: form.warehouseCode,
        locationCode: form.locationCode,
        remarks: form.remarks || null,
      });
      setPreview(result);
    } catch (err: any) {
      setError(err?.message || 'Preview failed');
    } finally {
      setLoadingPreview(false);
    }
  }

  async function doSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const result = await createH11BIssue({
        inventoryItemId: form.inventoryItemId,
        productName: form.productName,
        sku: form.sku || null,
        barcode: form.barcode || null,
        requestedQty: Number(form.requestedQty),
        reasonCode: form.reasonCode as H11BReasonCode,
        warehouseCode: form.warehouseCode,
        locationCode: form.locationCode,
        remarks: form.remarks || null,
      });

      setSuccess(`Created ${result.issue.issueNumber}`);
      router.push(`/stock-issues-h11b/${result.issue.id}`);
    } catch (err: any) {
      setError(err?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(defaultState);
    setPreview(null);
    setError('');
    setSuccess('');
  }

  return {
    form,
    preview,
    loadingPreview,
    submitting,
    error,
    success,
    updateField,
    doPreview,
    doSubmit,
    resetForm,
  };
}
'@

$fe_hook_history = @'
'use client';

import { useEffect, useState } from 'react';
import { listH11BIssues } from '../api';
import { H11BIssueRecord } from '../types';

export function useStockIssueH11BHistory() {
  const [items, setItems] = useState<H11BIssueRecord[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(nextQuery = query) {
    try {
      setLoading(true);
      setError('');
      const result = await listH11BIssues(nextQuery);
      setItems(result.items || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load issue history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load('');
  }, []);

  return {
    items,
    query,
    setQuery,
    load,
    loading,
    error,
  };
}
'@

$fe_hook_detail = @'
'use client';

import { useEffect, useState } from 'react';
import { getH11BIssue, getH11BPrint } from '../api';
import { H11BIssueRecord } from '../types';

export function useStockIssueH11BDetail(issueId: string, printMode = false) {
  const [issue, setIssue] = useState<H11BIssueRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError('');
        const result = printMode ? await getH11BPrint(issueId) : await getH11BIssue(issueId);
        if (active) setIssue(result.issue);
      } catch (err: any) {
        if (active) setError(err?.message || 'Failed to load issue detail');
      } finally {
        if (active) setLoading(false);
      }
    }

    if (issueId) {
      run();
    }

    return () => {
      active = false;
    };
  }, [issueId, printMode]);

  return {
    issue,
    loading,
    error,
  };
}
'@

$fe_screen_main = @'
'use client';

import { useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { useStockIssueH11BContext } from '../hooks/useStockIssueH11BContext';
import { useStockIssueH11BForm } from '../hooks/useStockIssueH11BForm';

const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: 10,
  border: '1px solid #d1d5db',
  borderRadius: 8,
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontWeight: 600,
};

export function StockIssueH11BScreen() {
  const { data, loading, error: contextError } = useStockIssueH11BContext();
  const {
    form,
    preview,
    loadingPreview,
    submitting,
    error,
    success,
    updateField,
    doPreview,
    doSubmit,
    resetForm,
  } = useStockIssueH11BForm();

  const filteredLocations = data.locations.filter(
    (item) => item.warehouseCode === form.warehouseCode
  );

  useEffect(() => {
    if (!form.reasonCode && data.reasonCodes[0]) {
      updateField('reasonCode', data.reasonCodes[0].code);
    }
  }, [data.reasonCodes]);

  useEffect(() => {
    if (!form.warehouseCode && data.warehouses[0]) {
      updateField('warehouseCode', data.warehouses[0].code);
    }
  }, [data.warehouses]);

  useEffect(() => {
    if (form.warehouseCode && filteredLocations.length > 0) {
      const currentStillValid = filteredLocations.some(
        (item) => item.code === form.locationCode
      );
      if (!currentStillValid) {
        updateField('locationCode', filteredLocations[0].code);
      }
    }
  }, [form.warehouseCode, filteredLocations.length]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>H11-B Stock Issue Sandbox</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>
            Safe learning page. This does not replace your released H11-A flow.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/stock-issues-h11b/history">History</Link>
          <Link href="/stock-issues">Live H11-A Page</Link>
        </div>
      </div>

      {(error || contextError) && (
        <div style={{ ...card, borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {error || contextError}
        </div>
      )}

      {success && (
        <div style={{ ...card, borderColor: '#bbf7d0', background: '#f0fdf4', color: '#166534' }}>
          {success}
        </div>
      )}

      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Issue Form</h2>

        {loading ? (
          <p>Loading context...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Inventory Item ID</label>
              <input
                style={inputStyle}
                value={form.inventoryItemId}
                onChange={(e) => updateField('inventoryItemId', e.target.value)}
                placeholder="INV-001"
              />
            </div>

            <div>
              <label style={labelStyle}>Product Name</label>
              <input
                style={inputStyle}
                value={form.productName}
                onChange={(e) => updateField('productName', e.target.value)}
                placeholder="Chicken Breast"
              />
            </div>

            <div>
              <label style={labelStyle}>SKU</label>
              <input
                style={inputStyle}
                value={form.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                placeholder="CHK-001"
              />
            </div>

            <div>
              <label style={labelStyle}>Barcode</label>
              <input
                style={inputStyle}
                value={form.barcode}
                onChange={(e) => updateField('barcode', e.target.value)}
                placeholder="9555000112233"
              />
            </div>

            <div>
              <label style={labelStyle}>Requested Qty</label>
              <input
                style={inputStyle}
                type="number"
                min={1}
                value={form.requestedQty}
                onChange={(e) => updateField('requestedQty', Number(e.target.value))}
              />
            </div>

            <div>
              <label style={labelStyle}>Reason Code</label>
              <select
                style={inputStyle}
                value={form.reasonCode}
                onChange={(e) => updateField('reasonCode', e.target.value as any)}
              >
                <option value="">Select reason</option>
                {data.reasonCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Warehouse</label>
              <select
                style={inputStyle}
                value={form.warehouseCode}
                onChange={(e) => updateField('warehouseCode', e.target.value)}
              >
                <option value="">Select warehouse</option>
                {data.warehouses.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Location</label>
              <select
                style={inputStyle}
                value={form.locationCode}
                onChange={(e) => updateField('locationCode', e.target.value)}
              >
                <option value="">Select location</option>
                {filteredLocations.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / span 2' }}>
              <label style={labelStyle}>Remarks</label>
              <textarea
                style={{ ...inputStyle, minHeight: 90 }}
                value={form.remarks}
                onChange={(e) => updateField('remarks', e.target.value)}
                placeholder="Kitchen production"
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={doPreview} disabled={loadingPreview || submitting}>
            {loadingPreview ? 'Previewing...' : 'Preview FEFO'}
          </button>
          <button onClick={doSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Commit Issue'}
          </button>
          <button onClick={resetForm} type="button">
            Reset
          </button>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Preview Result</h2>

        {!preview ? (
          <p>No preview yet.</p>
        ) : (
          <>
            <p><strong>Can Fulfill:</strong> {preview.canFulfill ? 'Yes' : 'No'}</p>
            <p><strong>Requested Qty:</strong> {preview.requestedQty}</p>
            <p><strong>Total Allocatable Qty:</strong> {preview.totalAllocatableQty}</p>
            <p><strong>Shortage Qty:</strong> {preview.shortageQty}</p>

            {preview.validation.length > 0 && (
              <div style={{ marginBottom: 12, color: '#92400e' }}>
                {preview.validation.map((msg, index) => (
                  <div key={index}>• {msg}</div>
                ))}
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Batch</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Expiry</th>
                  <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Available</th>
                  <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Allocated</th>
                </tr>
              </thead>
              <tbody>
                {preview.allocations.map((item) => (
                  <tr key={item.batchId}>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: 8 }}>{item.batchNumber}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: 8 }}>{item.expiryDate || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: 8, textAlign: 'right' }}>{item.availableQty}</td>
                    <td style={{ borderBottom: '1px solid #f3f4f6', padding: 8, textAlign: 'right' }}>{item.allocatedQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
'@

$fe_screen_history = @'
'use client';

import Link from 'next/link';
import { useStockIssueH11BHistory } from '../hooks/useStockIssueH11BHistory';

export function StockIssueH11BHistoryScreen() {
  const { items, query, setQuery, load, loading, error } = useStockIssueH11BHistory();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>H11-B Issue History</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Sandbox issue document history</p>
        </div>
        <Link href="/stock-issues-h11b">Create Issue</Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            style={{ flex: 1, padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by issue number, product, sku, barcode"
          />
          <button onClick={() => load(query)}>Search</button>
        </div>

        {error && <div style={{ color: '#991b1b', marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Issue No</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Product</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Reason</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Warehouse</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Issued Qty</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Created At</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.issueNumber}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.productName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.reasonCode}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                    {[item.warehouseName, item.locationName].filter(Boolean).join(' / ')}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.issuedQty}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/stock-issues-h11b/${item.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
'@

$fe_screen_detail = @'
'use client';

import Link from 'next/link';
import { useStockIssueH11BDetail } from '../hooks/useStockIssueH11BDetail';

export function StockIssueH11BDetailScreen({ issueId }: { issueId: string }) {
  const { issue, loading, error } = useStockIssueH11BDetail(issueId);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>H11-B Issue Detail</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Issue ID: {issueId}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/stock-issues-h11b">Create</Link>
          <Link href="/stock-issues-h11b/history">History</Link>
          <Link href={`/stock-issues-h11b/${issueId}/print`}>Print</Link>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div style={{ color: '#991b1b' }}>{error}</div>}

      {issue && (
        <>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Header</h2>
            <p><strong>Issue Number:</strong> {issue.issueNumber}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Product:</strong> {issue.productName}</p>
            <p><strong>SKU:</strong> {issue.sku || '-'}</p>
            <p><strong>Barcode:</strong> {issue.barcode || '-'}</p>
            <p><strong>Requested Qty:</strong> {issue.requestedQty}</p>
            <p><strong>Issued Qty:</strong> {issue.issuedQty}</p>
            <p><strong>Reason:</strong> {issue.reasonCode}</p>
            <p><strong>Warehouse / Location:</strong> {[issue.warehouseName, issue.locationName].filter(Boolean).join(' / ')}</p>
            <p><strong>Remarks:</strong> {issue.remarks || '-'}</p>
            <p><strong>Actor:</strong> {issue.actorName || '-'}</p>
            <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Allocations</h2>
            {issue.allocations.length === 0 ? (
              <p>No allocations.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Batch</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Expiry</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Available</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Allocated</th>
                  </tr>
                </thead>
                <tbody>
                  {issue.allocations.map((item) => (
                    <tr key={item.batchId}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.batchNumber}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.expiryDate || '-'}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.availableQty}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.allocatedQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Movement References</h2>
            {issue.movementRefs.length === 0 ? (
              <p>No movement refs.</p>
            ) : (
              <ul>
                {issue.movementRefs.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
'@

$fe_screen_print = @'
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStockIssueH11BDetail } from '../hooks/useStockIssueH11BDetail';

export function StockIssueH11BPrintScreen({ issueId }: { issueId: string }) {
  const { issue, loading, error } = useStockIssueH11BDetail(issueId, true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', color: '#111827' }}>
      <div style={{ marginBottom: 16 }}>
        <Link href={`/stock-issues-h11b/${issueId}`}>Back to Detail</Link>
      </div>

      {loading && <p>Loading print view...</p>}
      {error && <div style={{ color: '#991b1b' }}>{error}</div>}

      {issue && (
        <>
          <h1>Stock Issue Slip</h1>
          <p><strong>Issue Number:</strong> {issue.issueNumber}</p>
          <p><strong>Date:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          <p><strong>Actor:</strong> {issue.actorName || '-'}</p>
          <hr />
          <p><strong>Product:</strong> {issue.productName}</p>
          <p><strong>SKU:</strong> {issue.sku || '-'}</p>
          <p><strong>Barcode:</strong> {issue.barcode || '-'}</p>
          <p><strong>Requested Qty:</strong> {issue.requestedQty}</p>
          <p><strong>Issued Qty:</strong> {issue.issuedQty}</p>
          <p><strong>Reason:</strong> {issue.reasonCode}</p>
          <p><strong>Warehouse:</strong> {issue.warehouseName || '-'}</p>
          <p><strong>Location:</strong> {issue.locationName || '-'}</p>
          <p><strong>Remarks:</strong> {issue.remarks || '-'}</p>

          <h2>Allocations</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #111', padding: 8 }}>Batch</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #111', padding: 8 }}>Expiry</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #111', padding: 8 }}>Allocated</th>
              </tr>
            </thead>
            <tbody>
              {issue.allocations.map((item) => (
                <tr key={item.batchId}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{item.batchNumber}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{item.expiryDate || '-'}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8, textAlign: 'right' }}>{item.allocatedQty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div style={{ borderTop: '1px solid #111', paddingTop: 8 }}>Prepared By</div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #111', paddingTop: 8 }}>Received By</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
'@

Write-RepoFile $FE $FEBackup "src\app\stock-issues-h11b\page.tsx" $fe_page_main
Write-RepoFile $FE $FEBackup "src\app\stock-issues-h11b\history\page.tsx" $fe_page_history
Write-RepoFile $FE $FEBackup "src\app\stock-issues-h11b\[issueId]\page.tsx" $fe_page_detail
Write-RepoFile $FE $FEBackup "src\app\stock-issues-h11b\[issueId]\print\page.tsx" $fe_page_print

Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\types.ts" $fe_types
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\api.ts" $fe_api
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\hooks\useStockIssueH11BContext.ts" $fe_hook_context
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\hooks\useStockIssueH11BForm.ts" $fe_hook_form
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\hooks\useStockIssueH11BHistory.ts" $fe_hook_history
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\hooks\useStockIssueH11BDetail.ts" $fe_hook_detail
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\screens\StockIssueH11BScreen.tsx" $fe_screen_main
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\screens\StockIssueH11BHistoryScreen.tsx" $fe_screen_history
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\screens\StockIssueH11BDetailScreen.tsx" $fe_screen_detail
Write-RepoFile $FE $FEBackup "src\features\stock-issue-h11b\screens\StockIssueH11BPrintScreen.tsx" $fe_screen_print

# =========================
# BACKEND FILES
# =========================

$be_types = @'
export type H11BReasonCode =
  | 'PRODUCTION_USE'
  | 'INTERNAL_USE'
  | 'DAMAGE'
  | 'QUALITY_REJECT'
  | 'SAMPLE'
  | 'EXPIRY_DISPOSAL'
  | 'MANUAL_CONSUMPTION';

export interface H11BReasonOption {
  code: H11BReasonCode;
  label: string;
  active: boolean;
}

export interface H11BWarehouseOption {
  code: string;
  name: string;
  active: boolean;
}

export interface H11BLocationOption {
  code: string;
  name: string;
  warehouseCode: string;
  active: boolean;
}

export interface H11BContextResponse {
  reasonCodes: H11BReasonOption[];
  warehouses: H11BWarehouseOption[];
  locations: H11BLocationOption[];
}

export interface H11BPreviewRequest {
  inventoryItemId: string;
  productName: string;
  sku?: string | null;
  barcode?: string | null;
  requestedQty: number;
  reasonCode: H11BReasonCode;
  warehouseCode?: string | null;
  locationCode?: string | null;
  remarks?: string | null;
}

export interface H11BAllocation {
  batchId: string;
  batchNumber: string;
  expiryDate: string | null;
  allocatedQty: number;
  availableQty: number;
}

export interface H11BPreviewResponse {
  canFulfill: boolean;
  requestedQty: number;
  totalAllocatableQty: number;
  shortageQty: number;
  allocations: H11BAllocation[];
  validation: string[];
}

export interface H11BIssueRecord {
  id: string;
  issueNumber: string;
  status: 'POSTED';
  inventoryItemId: string;
  productName: string;
  sku?: string | null;
  barcode?: string | null;
  requestedQty: number;
  issuedQty: number;
  reasonCode: H11BReasonCode;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  locationCode?: string | null;
  locationName?: string | null;
  remarks?: string | null;
  actorName?: string | null;
  createdAt: string;
  updatedAt: string;
  allocations: H11BAllocation[];
  movementRefs: string[];
}

export interface H11BIssueListResponse {
  items: H11BIssueRecord[];
  total: number;
}
'@

$be_repository = @'
import * as fs from 'fs';
import * as path from 'path';
import { H11BIssueRecord } from './h11b-types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'h11b-stock-issues.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ items: [] }, null, 2), 'utf8');
  }
}

function readData(): { items: H11BIssueRecord[] } {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw || '{"items":[]}');
  return {
    items: Array.isArray(parsed.items) ? parsed.items : [],
  };
}

function writeData(data: { items: H11BIssueRecord[] }) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function listH11BIssuesRepo(): H11BIssueRecord[] {
  return readData().items;
}

export function getH11BIssueByIdRepo(issueId: string): H11BIssueRecord | null {
  const data = readData();
  return data.items.find((item) => item.id === issueId) || null;
}

export function createH11BIssueRepo(issue: H11BIssueRecord): H11BIssueRecord {
  const data = readData();
  data.items.unshift(issue);
  writeData(data);
  return issue;
}
'@

$be_service = @'
import {
  H11BAllocation,
  H11BContextResponse,
  H11BIssueListResponse,
  H11BIssueRecord,
  H11BLocationOption,
  H11BPreviewRequest,
  H11BPreviewResponse,
  H11BReasonOption,
  H11BWarehouseOption,
} from './h11b-types';
import {
  createH11BIssueRepo,
  getH11BIssueByIdRepo,
  listH11BIssuesRepo,
} from './h11b-issue-repository';

const reasonCodes: H11BReasonOption[] = [
  { code: 'PRODUCTION_USE', label: 'Production Use', active: true },
  { code: 'INTERNAL_USE', label: 'Internal Use', active: true },
  { code: 'DAMAGE', label: 'Damage', active: true },
  { code: 'QUALITY_REJECT', label: 'Quality Reject', active: true },
  { code: 'SAMPLE', label: 'Sample', active: true },
  { code: 'EXPIRY_DISPOSAL', label: 'Expiry Disposal', active: true },
  { code: 'MANUAL_CONSUMPTION', label: 'Manual Consumption', active: true },
];

const warehouses: H11BWarehouseOption[] = [
  { code: 'MAIN', name: 'Main Warehouse', active: true },
  { code: 'KITCHEN', name: 'Kitchen Store', active: true },
];

const locations: H11BLocationOption[] = [
  { code: 'A1', name: 'A1 Rack', warehouseCode: 'MAIN', active: true },
  { code: 'A2', name: 'A2 Rack', warehouseCode: 'MAIN', active: true },
  { code: 'K1', name: 'Kitchen Cold Room', warehouseCode: 'KITCHEN', active: true },
];

function buildMockAllocations(requestedQty: number): H11BAllocation[] {
  const sources = [
    {
      batchId: 'batch-h11b-001',
      batchNumber: 'B-20260610-001',
      expiryDate: '2026-06-10',
      availableQty: 5,
    },
    {
      batchId: 'batch-h11b-002',
      batchNumber: 'B-20260620-002',
      expiryDate: '2026-06-20',
      availableQty: 10,
    },
    {
      batchId: 'batch-h11b-003',
      batchNumber: 'B-20260715-003',
      expiryDate: '2026-07-15',
      availableQty: 20,
    },
  ];

  let remaining = Number(requestedQty || 0);
  const allocations: H11BAllocation[] = [];

  for (const source of sources) {
    if (remaining <= 0) break;
    const allocatedQty = Math.min(source.availableQty, remaining);
    if (allocatedQty > 0) {
      allocations.push({
        batchId: source.batchId,
        batchNumber: source.batchNumber,
        expiryDate: source.expiryDate,
        allocatedQty,
        availableQty: source.availableQty,
      });
      remaining -= allocatedQty;
    }
  }

  return allocations;
}

export function getH11BContext(): H11BContextResponse {
  return {
    reasonCodes,
    warehouses,
    locations,
  };
}

export function previewH11BIssueService(payload: H11BPreviewRequest): H11BPreviewResponse {
  const validation: string[] = [];

  if (!payload.inventoryItemId?.trim()) validation.push('Inventory Item ID is required');
  if (!payload.productName?.trim()) validation.push('Product Name is required');
  if (!payload.requestedQty || Number(payload.requestedQty) <= 0) validation.push('Requested Qty must be greater than 0');
  if (!payload.reasonCode) validation.push('Reason Code is required');
  if (!payload.warehouseCode) validation.push('Warehouse is required');
  if (!payload.locationCode) validation.push('Location is required');

  const allocations = buildMockAllocations(Number(payload.requestedQty || 0));
  const totalAllocatableQty = allocations.reduce((sum, item) => sum + item.allocatedQty, 0);
  const shortageQty = Math.max(0, Number(payload.requestedQty || 0) - totalAllocatableQty);

  if (shortageQty > 0) {
    validation.push(`Insufficient stock for full issue. Shortage: ${shortageQty}`);
  }

  return {
    canFulfill: validation.length === 0 || (validation.length === 1 && validation[0].startsWith('Insufficient stock') === false),
    requestedQty: Number(payload.requestedQty || 0),
    totalAllocatableQty,
    shortageQty,
    allocations,
    validation,
  };
}

export function createH11BIssueService(payload: H11BPreviewRequest): H11BIssueRecord {
  const preview = previewH11BIssueService(payload);

  if (preview.validation.length > 0) {
    throw new Error(preview.validation[0]);
  }

  if (!preview.canFulfill || preview.shortageQty > 0) {
    throw new Error(`Insufficient stock. Shortage: ${preview.shortageQty}`);
  }

  const all = listH11BIssuesRepo();
  const nextSequence = String(all.length + 1).padStart(4, '0');
  const today = new Date();
  const datePart = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('');

  const warehouseName =
    warehouses.find((item) => item.code === payload.warehouseCode)?.name || payload.warehouseCode || null;

  const locationName =
    locations.find((item) => item.code === payload.locationCode)?.name || payload.locationCode || null;

  const nowIso = new Date().toISOString();
  const issue: H11BIssueRecord = {
    id: `h11b-${Date.now()}`,
    issueNumber: `SI-H11B-${datePart}-${nextSequence}`,
    status: 'POSTED',
    inventoryItemId: payload.inventoryItemId,
    productName: payload.productName,
    sku: payload.sku || null,
    barcode: payload.barcode || null,
    requestedQty: Number(payload.requestedQty),
    issuedQty: Number(payload.requestedQty),
    reasonCode: payload.reasonCode,
    warehouseCode: payload.warehouseCode || null,
    warehouseName,
    locationCode: payload.locationCode || null,
    locationName,
    remarks: payload.remarks || null,
    actorName: 'System Admin',
    createdAt: nowIso,
    updatedAt: nowIso,
    allocations: preview.allocations,
    movementRefs: preview.allocations.map((item, index) => `MV-H11B-${datePart}-${String(index + 1).padStart(3, '0')}`),
  };

  return createH11BIssueRepo(issue);
}

export function listH11BIssuesService(q = ''): H11BIssueListResponse {
  const all = listH11BIssuesRepo();
  const keyword = q.trim().toLowerCase();

  if (!keyword) {
    return {
      items: all,
      total: all.length,
    };
  }

  const filtered = all.filter((item) => {
    const haystack = [
      item.issueNumber,
      item.productName,
      item.sku || '',
      item.barcode || '',
      item.reasonCode,
      item.warehouseName || '',
      item.locationName || '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(keyword);
  });

  return {
    items: filtered,
    total: filtered.length,
  };
}

export function getH11BIssueDetailService(issueId: string): H11BIssueRecord | null {
  return getH11BIssueByIdRepo(issueId);
}
'@

$be_routes = @'
import { Router, Request, Response } from 'express';
import {
  createH11BIssueService,
  getH11BContext,
  getH11BIssueDetailService,
  listH11BIssuesService,
  previewH11BIssueService,
} from './h11b-issue-service';

const router = Router();

router.get('/context', (_req: Request, res: Response) => {
  res.json(getH11BContext());
});

router.post('/preview', (req: Request, res: Response) => {
  try {
    const result = previewH11BIssueService(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || 'Preview failed',
    });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const issue = createH11BIssueService(req.body);
    res.status(201).json({ issue });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || 'Issue creation failed',
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '');
    const result = listH11BIssuesService(q);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || 'Issue list failed',
    });
  }
});

router.get('/:issueId/print', (req: Request, res: Response) => {
  try {
    const issue = getH11BIssueDetailService(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ issue });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || 'Issue print failed',
    });
  }
});

router.get('/:issueId', (req: Request, res: Response) => {
  try {
    const issue = getH11BIssueDetailService(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ issue });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || 'Issue detail failed',
    });
  }
});

export default router;
'@

Write-RepoFile $BE $BEBackup "src\modules\stock-control\h11b-types.ts" $be_types
Write-RepoFile $BE $BEBackup "src\modules\stock-control\h11b-issue-repository.ts" $be_repository
Write-RepoFile $BE $BEBackup "src\modules\stock-control\h11b-issue-service.ts" $be_service
Write-RepoFile $BE $BEBackup "src\modules\stock-control\h11b-issue-routes.ts" $be_routes

# =========================
# PATCH EXISTING BACKEND routes.ts
# =========================
$stockControlRoutesRel = "src\modules\stock-control\routes.ts"
$stockControlRoutesPath = Join-Path $BE $stockControlRoutesRel

if (Test-Path -LiteralPath $stockControlRoutesPath) {
  Backup-RepoFile $BE $BEBackup $stockControlRoutesRel
  $routesContent = Get-Content -LiteralPath $stockControlRoutesPath -Raw

  if ($routesContent -notmatch "h11b-issue-routes") {
    $routesContent = "import h11bIssueRouter from './h11b-issue-routes';`r`n" + $routesContent
  }

  if ($routesContent -notmatch "issues-h11b") {
    if ($routesContent -match "export default router;") {
      $routesContent = $routesContent -replace "export default router;", "router.use('/issues-h11b', h11bIssueRouter);`r`n`r`nexport default router;"
      Set-Content -LiteralPath $stockControlRoutesPath -Value $routesContent -Encoding UTF8
      Write-Host "Patched backend stock-control routes.ts automatically." -ForegroundColor Green
    }
    elseif ($routesContent -match "module\.exports\s*=\s*router") {
      $routesContent = $routesContent -replace "module\.exports\s*=\s*router", "router.use('/issues-h11b', h11bIssueRouter);`r`n`r`nmodule.exports = router"
      Set-Content -LiteralPath $stockControlRoutesPath -Value $routesContent -Encoding UTF8
      Write-Host "Patched backend stock-control routes.ts automatically." -ForegroundColor Green
    }
    else {
      $manualPatch = @"
Please patch this file manually:

FILE:
$stockControlRoutesPath

ADD IMPORT:
import h11bIssueRouter from './h11b-issue-routes';

ADD BEFORE EXPORT:
router.use('/issues-h11b', h11bIssueRouter);
"@
      $manualPatchPath = Join-Path $BE "H11B_MANUAL_PATCH_backend.txt"
      Set-Content -LiteralPath $manualPatchPath -Value $manualPatch -Encoding UTF8
      Write-Host "Could not auto-patch routes.ts shape. Manual patch file created: $manualPatchPath" -ForegroundColor Yellow
    }
  }
  else {
    Write-Host "Backend routes.ts already contains issues-h11b mount." -ForegroundColor DarkYellow
  }
}
else {
  Write-Host "WARNING: Could not find backend routes.ts to patch." -ForegroundColor Red
}

# =========================
# CREATE BACKEND DATA FILE
# =========================
Ensure-Dir (Join-Path $BE "data")
$DataFilePath = Join-Path $BE "data\h11b-stock-issues.json"
if (-not (Test-Path -LiteralPath $DataFilePath)) {
  Set-Content -LiteralPath $DataFilePath -Value '{ "items": [] }' -Encoding UTF8
  Write-Host "Created data file: $DataFilePath" -ForegroundColor Green
} else {
  Write-Host "Data file already exists: $DataFilePath" -ForegroundColor DarkYellow
}

# =========================
# WRITE RUN NOTES
# =========================
$notes = @"
H11-B EASY SANDBOX GENERATED

Frontend routes:
- http://localhost:3000/stock-issues-h11b
- http://localhost:3000/stock-issues-h11b/history

Backend routes:
- GET  http://localhost:4000/api/stock-control/issues-h11b/context
- POST http://localhost:4000/api/stock-control/issues-h11b/preview
- POST http://localhost:4000/api/stock-control/issues-h11b
- GET  http://localhost:4000/api/stock-control/issues-h11b
- GET  http://localhost:4000/api/stock-control/issues-h11b/{issueId}
- GET  http://localhost:4000/api/stock-control/issues-h11b/{issueId}/print

IMPORTANT:
- Do NOT stage temp-run-pack.ps1
- Do NOT stage temp-pack-backups/
- This is a safe sandbox for learning and verification
"@

Set-Content -LiteralPath (Join-Path $FE "H11B_EASY_SANDBOX_NOTES.txt") -Value $notes -Encoding UTF8

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host "Frontend sandbox created." -ForegroundColor Green
Write-Host "Backend sandbox created." -ForegroundColor Green
Write-Host "Restart backend and frontend dev servers now." -ForegroundColor Yellow