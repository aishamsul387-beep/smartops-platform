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
                  <div key={index}>â€¢ {msg}</div>
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
