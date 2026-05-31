'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { inventoryApi } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';
import { useStockIssue } from '../hooks/useStockIssue';

export function StockIssueScreen() {
  const router = useRouter();
  const { preview, result, isPreviewLoading, isSubmitting, error, previewIssue, submitIssue } =
    useStockIssue();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  const [inventoryItemId, setInventoryItemId] = useState('');
  const [requestedQty, setRequestedQty] = useState('1');
  const [reason, setReason] = useState('');

  useEffect(() => {
    async function loadInventory() {
      try {
        setIsInventoryLoading(true);
        const response = await inventoryApi.getInventoryList({ search: '', status: 'all' });
        setInventoryItems(response.items.filter((item) => item.isActive));
      } catch {
        setInventoryItems([]);
      } finally {
        setIsInventoryLoading(false);
      }
    }

    void loadInventory();
  }, []);

  const selectedInventory = useMemo(
    () => inventoryItems.find((item) => item.id === inventoryItemId) || null,
    [inventoryItems, inventoryItemId]
  );

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const qty = Number(requestedQty);

    if (!inventoryItemId.trim() || Number.isNaN(qty) || qty <= 0) {
      return;
    }

    try {
      await previewIssue(inventoryItemId, qty);
    } catch {
      // hook error shown on screen
    }
  }

  async function handleCommit() {
    const qty = Number(requestedQty);

    if (!inventoryItemId.trim() || Number.isNaN(qty) || qty <= 0) {
      return;
    }

    try {
      const response = await submitIssue({
        inventoryItemId,
        requestedQty: qty,
        reason: reason.trim()
      });

      router.push('/stock-movements');
      router.refresh();
      return response;
    } catch {
      // hook error shown on screen
    }
  }

  const hasShortfall = (preview?.remainingUnallocatedQty || 0) > 0;

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
              Inventory Issue + FEFO Allocation
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Preview and commit outbound issue allocation using FEFO from available batches.
            </div>
          </div>

          <Link
            href="/stock-control"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            Back to Stock Control
          </Link>
        </div>
      </div>

      <form
        onSubmit={handlePreview}
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Product Name
            </label>
            <select
              value={inventoryItemId}
              onChange={(e) => setInventoryItemId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="">
                {isInventoryLoading ? 'Loading inventory...' : 'Select product'}
              </option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>SKU</label>
            <div style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
              {selectedInventory?.sku || '-'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Barcode</label>
            <div style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
              {selectedInventory?.barcode || '-'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Requested Qty</label>
            <input
              value={requestedQty}
              onChange={(e) => setRequestedQty(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', resize: 'vertical' }}
            />
          </div>
        </div>

        {error ? (
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
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <button
            type="submit"
            disabled={isPreviewLoading}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: isPreviewLoading ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              fontWeight: 600
            }}
          >
            {isPreviewLoading ? 'Previewing...' : 'Preview FEFO Allocation'}
          </button>

          {preview ? (
            <button
              type="button"
              disabled={isSubmitting || hasShortfall}
              onClick={() => void handleCommit()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isSubmitting || hasShortfall ? '#94a3b8' : '#7c3aed',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Issuing...' : 'Commit Issue'}
            </button>
          ) : null}
        </div>
      </form>

      {preview ? (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            FEFO Allocation Preview
          </div>

          <div style={{ marginBottom: '16px', color: '#475569' }}>
            Requested: <strong>{preview.requestedQty}</strong> Â·
            Available: <strong>{preview.totalAvailableQty}</strong> Â·
            Allocated: <strong>{preview.allocatedQty}</strong> Â·
            Unallocated: <strong>{preview.remainingUnallocatedQty}</strong>
          </div>

          {hasShortfall ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              Requested quantity exceeds available FEFO-eligible stock.
            </div>
          ) : null}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Batch</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Available Before</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Issue Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Available After</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Expiry</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Unit Cost</th>
                </tr>
              </thead>
              <tbody>
                {preview.allocations.map((row) => (
                  <tr key={row.batchId}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {row.batchNumber}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.availableQtyBefore}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.issuedQty}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.availableQtyAfter}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.expiryDate || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.zone}-{row.aisle}-{row.levelCode}-{row.bin}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {row.currency} {Number(row.unitCost).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result ? (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#166534',
                border: '1px solid #bbf7d0'
              }}
            >
              Stock issue <strong>{result.issue.issueNo}</strong> created successfully.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}