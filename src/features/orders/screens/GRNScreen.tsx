'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ROUTES } from '@/lib/routes';
import { ordersApi } from '../api';
import { useGoodsReceivedNotes } from '../hooks/useGoodsReceivedNotes';

function getStatusColor(status: string) {
  if (status === 'posted') {
    return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
  }

  return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
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

  return parsed.toLocaleString();
}

export function GRNScreen() {
  const { items, filters, isLoading, error, updateSearch, updateStatus, refresh } =
    useGoodsReceivedNotes();
  const [postingId, setPostingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const summary = useMemo(() => {
    const draftCount = items.filter((item) => item.status === 'draft').length;
    const postedCount = items.filter((item) => item.status === 'posted').length;
    const linkedBatchCount = items.filter((item) => item.status === 'posted' && item.linkedBatchId).length;
    const draftWithoutBatchCount = items.filter((item) => item.status === 'draft' && !item.linkedBatchId).length;

    return {
      draftCount,
      postedCount,
      linkedBatchCount,
      draftWithoutBatchCount
    };
  }, [items]);

  async function handlePost(id: string) {
    try {
      setPostingId(id);
      setActionError(null);
      await ordersApi.postGRN(id);
      await refresh();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to post GRN');
    } finally {
      setPostingId(null);
    }
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Goods Received Notes</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              GRN list now highlights draft/posting follow-up and linked batch visibility at list level.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.orders} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to orders
            </Link>
            <Link href={ROUTES.goodsReceivedNotesCreate} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f766e', color: '#ffffff', fontWeight: 600 }}>
              Create GRN
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
          label="Draft GRNs"
          value={summary.draftCount}
          hint="Still need posting to complete receiving."
          tone={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
        />
        <SummaryCard
          label="Posted GRNs"
          value={summary.postedCount}
          hint="Receiving posting is complete."
          tone={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
        />
        <SummaryCard
          label="Posted With Linked Batch"
          value={summary.linkedBatchCount}
          hint="Ready for direct batch drill-down."
          tone={{ background: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd' }}
        />
        <SummaryCard
          label="Draft Without Batch Link"
          value={summary.draftWithoutBatchCount}
          hint="Posting will complete the batch link."
          tone={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74' }}
        />
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

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="grn-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input
              id="grn-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search GRN no, PO no, supplier"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="grn-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
            <select
              id="grn-status"
              value={filters.status || 'all'}
              onChange={(event) => updateStatus(event.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading GRNs...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>GRN No</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PO No</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Lines</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Received Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Batch Visibility</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Posted</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const hasLinkedBatch = Boolean(item.linkedBatchId);
                  const isDraft = item.status === 'draft';

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        <Link href={ROUTES.goodsReceivedNoteDetail(item.id)} style={{ color: '#2563eb' }}>
                          {item.grnNo}
                        </Link>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.poNo}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierName}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.receivedLines}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.receivedQty}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
                          {item.statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {hasLinkedBatch ? (
                          <span style={{ color: '#6d28d9', fontWeight: 700 }}>Linked batch ready</span>
                        ) : isDraft ? (
                          <span style={{ color: '#9a3412', fontSize: '13px' }}>
                            Post GRN to create batch link
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '13px' }}>
                            No linked batch
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{formatDate(item.postedAt)}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <Link href={ROUTES.goodsReceivedNoteDetail(item.id)} style={{ color: '#2563eb', fontWeight: 600 }}>
                            View
                          </Link>

                          {isDraft ? (
                            <button
                              type="button"
                              onClick={() => void handlePost(item.id)}
                              disabled={postingId === item.id}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: postingId === item.id ? '#94a3b8' : '#0f172a',
                                color: '#ffffff',
                                cursor: postingId === item.id ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                fontSize: '12px'
                              }}
                            >
                              {postingId === item.id ? 'Posting...' : 'Post GRN'}
                            </button>
                          ) : null}

                          {hasLinkedBatch ? (
                            <Link
                              href={`/batches/${item.linkedBatchId}`}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: '#7c3aed',
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '12px'
                              }}
                            >
                              Open Batch
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
