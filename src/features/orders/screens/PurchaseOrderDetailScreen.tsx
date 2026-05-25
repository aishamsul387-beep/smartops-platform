'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ordersApi } from '../api';
import { usePurchaseOrderDetail } from '../hooks/usePurchaseOrderDetail';

function getStatusStyle(status: string) {
  if (status === 'draft') {
    return {
      background: '#e2e8f0',
      color: '#334155',
      border: '1px solid #cbd5e1'
    };
  }

  if (status === 'issued') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    };
  }

  if (status === 'partially_received') {
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

function getSupplierSourceLabel(value: string) {
  if (value === 'inventory_master') return 'Inventory Master';
  if (value === 'batch_history') return 'Batch History';
  return 'Unassigned';
}

function DetailRow({
  label,
  value
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid #f1f5f9'
      }}
    >
      <div style={{ color: '#64748b', fontWeight: 600 }}>{label}</div>
      <div>{value === null || value === undefined || value === '' ? '-' : value}</div>
    </div>
  );
}

export function PurchaseOrderDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = usePurchaseOrderDetail(id);
  const [isIssuing, setIsIssuing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleIssue() {
    if (!item) {
      return;
    }

    try {
      setIsIssuing(true);
      setActionError(null);
      await ordersApi.issuePurchaseOrder(item.id);
      await refresh();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to issue purchase order');
    } finally {
      setIsIssuing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading purchase order...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>
            {error || 'Purchase order not found'}
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
            Retry
          </button>
        </div>
      </div>
    );
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
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              {item.poNo}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Supplier: {item.supplierName}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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
              {item.statusLabel}
            </span>

            {item.status === 'draft' ? (
              <button
                type="button"
                disabled={isIssuing}
                onClick={() => void handleIssue()}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isIssuing ? '#94a3b8' : '#0f172a',
                  color: '#ffffff',
                  cursor: isIssuing ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {isIssuing ? 'Issuing...' : 'Issue PO'}
              </button>
            ) : null}

            <Link
              href="/orders/purchase-orders"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back
            </Link>
          </div>
        </div>

        {actionError ? (
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
            {actionError}
          </div>
        ) : null}
      </div>

      {item.planningContext ? (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>
            Created from Procurement Planning
          </div>
          <div style={{ color: '#1e3a8a', lineHeight: 1.6 }}>
            This purchase order was generated from Stock Control planning and keeps traceability to
            the original reorder recommendation.
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Purchase Order Details
          </div>
          <DetailRow label="PO No" value={item.poNo} />
          <DetailRow label="Supplier" value={item.supplierName} />
          <DetailRow label="Line Count" value={item.lines.length} />
          <DetailRow label="Total Amount" value={`${item.currency} ${Number(item.totalAmount).toFixed(2)}`} />
          <DetailRow label="Expected Date" value={item.expectedDate} />
          <DetailRow label="Created At" value={item.createdAt} />
        </div>

        {item.planningContext ? (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
              Planning Context
            </div>
            <DetailRow label="Planning Source" value={item.planningContext.planningSource} />
            <DetailRow label="Inventory Item ID" value={item.planningContext.inventoryItemId} />
            <DetailRow label="Item Code" value={item.planningContext.itemCode} />
            <DetailRow label="Item Name" value={item.planningContext.itemName} />
            <DetailRow label="Suggested Qty" value={item.planningContext.suggestedOrderQty} />
            <DetailRow label="Supplier Source" value={getSupplierSourceLabel(item.planningContext.supplierSource)} />
            <DetailRow label="Estimated Value" value={`${item.currency} ${Number(item.planningContext.estimatedReorderValue).toFixed(2)}`} />
            <DetailRow label="Reorder By Date" value={item.planningContext.reorderByDate} />
          </div>
        ) : null}
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
          Purchase Order Lines
        </div>

        {item.lines.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No line items found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Line</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Item</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Unit Cost</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Line Total</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {item.lines.map((line) => (
                  <tr key={line.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {line.lineNo}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{line.itemCode}</div>
                      <div>{line.itemName}</div>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {line.orderedQty}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {line.currency} {Number(line.unitCost).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {line.currency} {Number(line.lineTotal).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {line.notes || '-'}
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