'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ROUTES } from '@/lib/routes';
import { ordersApi } from '../api';
import { useQuotations } from '../hooks/useQuotations';
import type { Quotation } from '../types';

function getStatusStyle(status: string) {
  if (status === 'approved') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  if (status === 'sent') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    };
  }

  if (status === 'rejected') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  return {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a'
  };
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

function formatCurrency(currency: string, amount: number) {
  return `${currency} ${Number(amount || 0).toFixed(2)}`;
}

function formatDate(value: string | null | undefined) {
  const text = String(value ?? '').trim();
  if (!text) return '-';

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }

  return parsed.toLocaleString();
}

function getQuotationNextStep(item: Quotation) {
  if (item.status === 'approved') {
    return {
      title: 'Ready for PO follow-up',
      detail: 'Approved supplier quotation. Continue into purchase order creation.',
      tone: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
    };
  }

  if (item.status === 'sent') {
    return {
      title: 'Waiting supplier response',
      detail: 'Quotation has been sent and is waiting approval or rejection.',
      tone: { background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }
    };
  }

  if (item.status === 'rejected') {
    return {
      title: 'Review / replace supplier',
      detail: 'This quotation was rejected and may need follow-up or replacement sourcing.',
      tone: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
    };
  }

  return {
    title: 'Needs review before send',
    detail: 'Draft quotation is still internal and should be reviewed before supplier outreach.',
    tone: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }
  };
}

export function QuotationListScreen() {
  const { items, filters, isLoading, error, updateSearch, updateStatus, refresh } = useQuotations();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const summary = useMemo(() => {
    return {
      draftCount: items.filter((item) => item.status === 'draft').length,
      sentCount: items.filter((item) => item.status === 'sent').length,
      approvedCount: items.filter((item) => item.status === 'approved').length,
      rejectedCount: items.filter((item) => item.status === 'rejected').length
    };
  }, [items]);

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      setActionError(null);
      await refresh();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to refresh quotations');
    } finally {
      setIsRefreshing(false);
    }
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
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Quotations</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Quotation workspace now highlights approval readiness, supplier response visibility, and the next operator action into procurement flow.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.orders}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to orders
            </Link>

            <Link
              href={ROUTES.purchaseOrders}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f766e',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Open Purchase Orders
            </Link>

            <button
              type="button"
              onClick={() => void handleRefresh()}
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
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {actionError ? (
        <div
          style={{
            marginBottom: '24px',
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <SummaryCard
          label="Draft Quotations"
          value={summary.draftCount}
          hint="Still internal and awaiting operator review before being sent."
          tone={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
        />
        <SummaryCard
          label="Sent Quotations"
          value={summary.sentCount}
          hint="Waiting on supplier response or negotiation follow-up."
          tone={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
        />
        <SummaryCard
          label="Approved Quotations"
          value={summary.approvedCount}
          hint="Ready to move into purchase order follow-up."
          tone={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
        />
        <SummaryCard
          label="Rejected Quotations"
          value={summary.rejectedCount}
          hint="Needs supplier replacement, review, or closure."
          tone={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
        />
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
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
            <label htmlFor="quotation-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="quotation-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search quotation no or supplier"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="quotation-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="quotation-status"
              value={filters.status || 'all'}
              onChange={(event) => updateStatus(event.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading quotations...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Quotation No</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Items</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Created</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Workflow Visibility</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const nextStep = getQuotationNextStep(item);

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        {item.quotationNo}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierName}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.itemCount}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(item.currency, item.totalAmount)}</td>
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
                          {item.statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{formatDate(item.createdAt)}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            background: nextStep.tone.background,
                            color: nextStep.tone.color,
                            border: nextStep.tone.border
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>{nextStep.title}</div>
                          <div>{nextStep.detail}</div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <Link href={ROUTES.quotations} style={{ color: '#2563eb', fontWeight: 600 }}>
                            View
                          </Link>

                          {item.status === 'approved' ? (
                            <Link
                              href={ROUTES.purchaseOrdersCreate}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: '#0f766e',
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '12px'
                              }}
                            >
                              Create PO
                            </Link>
                          ) : null}

                          <Link
                            href={ROUTES.purchaseOrders}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: '#ffffff',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              fontWeight: 600,
                              fontSize: '12px'
                            }}
                          >
                            Open POs
                          </Link>
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

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
          Quotation workflow reminders
        </div>
        <div style={{ display: 'grid', gap: '10px', color: '#475569' }}>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            Draft quotations should be reviewed internally before being sent.
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe'
            }}
          >
            Sent quotations usually need supplier follow-up or approval tracking.
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0'
            }}
          >
            Approved quotations are the strongest candidates for moving into purchase order creation.
          </div>
        </div>
      </div>
    </div>
  );
}
