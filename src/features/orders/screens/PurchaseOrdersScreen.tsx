'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ROUTES } from '@/lib/routes';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import type { PurchaseOrder } from '../types';

function getStatusColor(status: string) {
  if (status === 'received') {
    return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
  }

  if (status === 'partially_received') {
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
  }

  if (status === 'issued') {
    return { background: '#e0f2fe', color: '#075985', border: '1px solid #bae6fd' };
  }

  return { background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1' };
}

function SummaryCard({
  label,
  value,
  hint,
  tone
}: {
  label: string;
  value: number;
  hint: string;
  tone: {
    background: string;
    color: string;
    border: string;
  };
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: tone.border,
        borderRadius: '16px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: tone.color }}>{value}</div>
      <div
        style={{
          marginTop: '8px',
          padding: '8px 10px',
          borderRadius: '10px',
          background: tone.background,
          color: tone.color,
          fontSize: '13px'
        }}
      >
        {hint}
      </div>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  const text = String(value ?? '').trim();
  if (!text) return '-';

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }

  return parsed.toLocaleDateString();
}

function formatCurrency(currency: string, amount: number) {
  return `${currency} ${Number(amount || 0).toFixed(2)}`;
}

function getLineTotals(item: PurchaseOrder) {
  const totalOrdered = (item.lines || []).reduce((sum, line) => sum + Number(line.orderedQty || 0), 0);
  const totalReceived = (item.lines || []).reduce((sum, line) => sum + Number(line.receivedQty || 0), 0);
  const remainingQty = Math.max(totalOrdered - totalReceived, 0);
  const receivableLines = (item.lines || []).filter(
    (line) => Number(line.receivedQty || 0) < Number(line.orderedQty || 0)
  ).length;

  return {
    totalOrdered,
    totalReceived,
    remainingQty,
    receivableLines
  };
}

function getFollowUpContext(item: PurchaseOrder) {
  const totals = getLineTotals(item);

  if (item.status === 'draft') {
    return {
      title: 'Issue required',
      detail: 'Issue this purchase order before receiving can begin.',
      tone: { background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1' },
      ...totals
    };
  }

  if (item.status === 'issued' && totals.remainingQty > 0) {
    return {
      title: 'Ready for receiving',
      detail: `${totals.receivableLines} receivable line(s) â€¢ Remaining qty ${totals.remainingQty}`,
      tone: { background: '#e0f2fe', color: '#075985', border: '1px solid #bae6fd' },
      ...totals
    };
  }

  if (item.status === 'partially_received' && totals.remainingQty > 0) {
    return {
      title: 'Continue receiving',
      detail: `${totals.receivableLines} open line(s) â€¢ Remaining qty ${totals.remainingQty}`,
      tone: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
      ...totals
    };
  }

  return {
    title: 'Receiving complete',
    detail: `Received ${totals.totalReceived} / Ordered ${totals.totalOrdered}`,
    tone: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
    ...totals
  };
}

export function PurchaseOrdersScreen() {
  const { items, filters, isLoading, error, updateSearch, updateStatus, refresh } =
    usePurchaseOrders();

  const summary = useMemo(() => {
    const draftCount = items.filter((item) => item.status === 'draft').length;
    const issuedWaitingCount = items.filter((item) => {
      const totals = getLineTotals(item);
      return item.status === 'issued' && totals.remainingQty > 0;
    }).length;
    const partialCount = items.filter((item) => {
      const totals = getLineTotals(item);
      return item.status === 'partially_received' && totals.remainingQty > 0;
    }).length;
    const receivedCount = items.filter((item) => item.status === 'received').length;

    return {
      draftCount,
      issuedWaitingCount,
      partialCount,
      receivedCount
    };
  }, [items]);

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Purchase Orders</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Purchase order list now highlights receiving follow-up and exception visibility for faster operator action.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.orders} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to orders
            </Link>
            <Link href={ROUTES.purchaseOrdersCreate} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f766e', color: '#ffffff', fontWeight: 600 }}>
              Create PO
            </Link>
            <button
              type="button"
              onClick={() => void refresh()}
              style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <SummaryCard
          label="Draft POs"
          value={summary.draftCount}
          hint="Still need issuing before receiving can start."
          tone={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1' }}
        />
        <SummaryCard
          label="Issued Waiting for Receiving"
          value={summary.issuedWaitingCount}
          hint="Ready to hand off into GRN creation."
          tone={{ background: '#e0f2fe', color: '#075985', border: '1px solid #bae6fd' }}
        />
        <SummaryCard
          label="Partially Received"
          value={summary.partialCount}
          hint="Still has receivable quantity remaining."
          tone={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
        />
        <SummaryCard
          label="Fully Received"
          value={summary.receivedCount}
          hint="Receiving is complete."
          tone={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
        />
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="po-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input
              id="po-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search PO no, supplier, quotation"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="po-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="po-status"
              value={filters.status || 'all'}
              onChange={(event) => updateStatus(event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="issued">Issued</option>
              <option value="partially_received">Partially received</option>
              <option value="received">Received</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading purchase orders...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PO No</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Quotation</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Expected</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Receiving Visibility</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const followUp = getFollowUpContext(item);

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        <Link href={ROUTES.purchaseOrderDetail(item.id)} style={{ color: '#2563eb' }}>
                          {item.poNo}
                        </Link>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierName}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.quotationNo || '-'}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(item.currency, item.totalAmount)}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{formatDate(item.expectedDate)}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
                          {item.statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            ...followUp.tone
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>{followUp.title}</div>
                          <div>{followUp.detail}</div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <Link href={ROUTES.purchaseOrderDetail(item.id)} style={{ fontWeight: 600, color: '#2563eb' }}>
                            View
                          </Link>

                          {(item.status === 'issued' || item.status === 'partially_received') && followUp.remainingQty > 0 ? (
                            <Link
                              href={`${ROUTES.goodsReceivedNotesCreate}?poId=${encodeURIComponent(item.id)}&poNo=${encodeURIComponent(item.poNo)}`}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: '#0f766e',
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '12px'
                              }}
                            >
                              Create GRN
                            </Link>
                          ) : null}
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
    </div>
  );
}
