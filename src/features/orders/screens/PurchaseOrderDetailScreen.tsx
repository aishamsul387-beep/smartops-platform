'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/lib/routes';
import { ordersApi } from '../api';
import { usePurchaseOrderDetail } from '../hooks/usePurchaseOrderDetail';
import { usePurchaseOrderLineInventorySummary } from '../hooks/usePurchaseOrderLineInventorySummary';

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

function safeText(value: unknown) {
  const text = String(value ?? '').trim();
  return text || '-';
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

function CopyReferenceCard({
  label,
  value,
  copied,
  onCopy
}: {
  label: string;
  value: string | number | null | undefined;
  copied: boolean;
  onCopy: () => void;
}) {
  const displayValue = value === null || value === undefined || value === '' ? '-' : String(value);
  const canCopy = displayValue !== '-';

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 700, wordBreak: 'break-word' }}>{displayValue}</div>

      <div style={{ marginTop: '14px' }}>
        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: canCopy ? '#ffffff' : '#f8fafc',
            color: canCopy ? '#334155' : '#94a3b8',
            cursor: canCopy ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = String(searchParams.get('source') ?? '').trim();
  const quotationNoFromQuery = String(searchParams.get('quotationNo') ?? '').trim();
  const { item, isLoading, error, refresh } = usePurchaseOrderDetail(id);
  const [isIssuing, setIsIssuing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const {
    itemsById: inventorySummaryById,
    isLoading: isInventorySummaryLoading,
    error: inventorySummaryError
  } = usePurchaseOrderLineInventorySummary(item?.lines || []);

  async function handleIssue() {
    if (!item) {
      return;
    }

    try {
      setIsIssuing(true);
      setActionError(null);

      const issued = await ordersApi.issuePurchaseOrder(item.id);

      router.replace(
        `${ROUTES.goodsReceivedNotesCreate}?poId=${encodeURIComponent(issued.id)}&poNo=${encodeURIComponent(
          issued.poNo
        )}`
      );
      router.refresh();
      return;
    } catch (err: any) {
      setActionError(err?.message || 'Failed to issue purchase order');
    } finally {
      setIsIssuing(false);
    }
  }

  async function handleCopy(key: string, value: unknown) {
    const text = String(value ?? '').trim();
    if (!text || typeof window === 'undefined') {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1500);
    } catch {
      // no-op
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

        {source === 'quotation-handoff' && (item.quotationNo || quotationNoFromQuery) ? (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0'
            }}
          >
            Purchase order created from approved quotation{' '}
            <strong>{item.quotationNo || quotationNoFromQuery}</strong>. Continue with issuing,
            receiving, and traceability follow-up from this record.
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <CopyReferenceCard
          label="PO No"
          value={item.poNo}
          copied={copiedKey === 'poNo'}
          onCopy={() => void handleCopy('poNo', item.poNo)}
        />
        <CopyReferenceCard
          label="Supplier"
          value={item.supplierName}
          copied={copiedKey === 'supplierName'}
          onCopy={() => void handleCopy('supplierName', item.supplierName)}
        />
        <CopyReferenceCard
          label="Expected Date"
          value={formatDate(item.expectedDate)}
          copied={copiedKey === 'expectedDate'}
          onCopy={() => void handleCopy('expectedDate', item.expectedDate)}
        />
        <CopyReferenceCard
          label="Created At"
          value={formatDate(item.createdAt)}
          copied={copiedKey === 'createdAt'}
          onCopy={() => void handleCopy('createdAt', item.createdAt)}
        />
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
          <DetailRow label="Expected Date" value={formatDate(item.expectedDate)} />
          <DetailRow label="Created At" value={formatDate(item.createdAt)} />
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
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        <div style={{ padding: '20px', fontSize: '22px', fontWeight: 700 }}>
          Purchase Order Lines
        </div>

        {inventorySummaryError ? (
          <div style={{ padding: '0 20px 16px 20px', color: '#b91c1c' }}>
            {inventorySummaryError}
          </div>
        ) : null}

        {item.lines.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No line items found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Line</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Barcode</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Product Name</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Ordered Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Received Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Remaining Qty</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Unit Cost</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Line Total</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {item.lines.map((line) => {
                  const remainingQty = Math.max(line.orderedQty - line.receivedQty, 0);
                  const inventorySummary = inventorySummaryById[line.inventoryItemId];

                  return (
                    <tr key={line.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                        {line.lineNo}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {inventorySummary?.sku || line.itemCode || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {isInventorySummaryLoading && !inventorySummary ? 'Loading...' : inventorySummary?.barcode || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {inventorySummary?.name || line.itemName || '-'}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {line.orderedQty}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {line.receivedQty}
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                        {remainingQty}
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
          padding: '20px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
          Receipt History by PO Line
        </div>

        {item.lines.length === 0 ? (
          <div style={{ color: '#64748b' }}>No PO lines available.</div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {item.lines.map((line) => {
              const inventorySummary = inventorySummaryById[line.inventoryItemId];

              return (
                <div
                  key={`${line.id}-history`}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                    Line {line.lineNo} â€¢ {inventorySummary?.sku || line.itemCode || '-'} â€¢ {inventorySummary?.name || line.itemName || '-'}
                  </div>

                  {!line.receiptHistory || line.receiptHistory.length === 0 ? (
                    <div style={{ color: '#64748b' }}>No receipt history yet.</div>
                  ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {line.receiptHistory.map((receipt) => {
                        const batchLinkUnavailableReason =
                          receipt.status === 'draft'
                            ? 'Batch link will become available after this GRN is posted.'
                            : 'No linked batch is recorded for this GRN.';

                        return (
                          <div
                            key={receipt.grnId}
                            style={{
                              padding: '12px',
                              borderRadius: '10px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                alignItems: 'center',
                                marginBottom: '8px'
                              }}
                            >
                              <Link href={`/orders/goods-received-notes/${receipt.grnId}`} style={{ color: '#2563eb', fontWeight: 700 }}>
                                {receipt.grnNo}
                              </Link>

                              <button
                                type="button"
                                onClick={() => void handleCopy(`grn-${receipt.grnId}`, receipt.grnNo)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  fontSize: '12px'
                                }}
                              >
                                {copiedKey === `grn-${receipt.grnId}` ? 'Copied GRN' : 'Copy GRN No'}
                              </button>

                              {receipt.linkedBatchId ? (
                                <>
                                  <Link
                                    href={`/batches/${receipt.linkedBatchId}`}
                                    style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700 }}
                                  >
                                    Open Batch {receipt.linkedBatchId}
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => void handleCopy(`batch-${receipt.grnId}`, receipt.linkedBatchId)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '8px',
                                      border: '1px solid #cbd5e1',
                                      background: '#ffffff',
                                      color: '#334155',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                      fontSize: '12px'
                                    }}
                                  >
                                    {copiedKey === `batch-${receipt.grnId}` ? 'Copied Batch' : 'Copy Batch ID'}
                                  </button>
                                </>
                              ) : null}
                            </div>

                            <div style={{ color: '#475569', fontSize: '14px' }}>
                              Received Qty: <strong>{receipt.receivedQty}</strong> â€¢
                              Status: <strong>{receipt.status}</strong> â€¢
                              Received Date: <strong>{formatDate(receipt.receivedDate)}</strong>
                            </div>

                            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                              Linked Batch: <strong>{receipt.linkedBatchId || '-'}</strong> â€¢
                              Posted At: <strong>{formatDate(receipt.postedAt)}</strong>
                            </div>

                            {!receipt.linkedBatchId ? (
                              <div
                                style={{
                                  marginTop: '8px',
                                  padding: '10px 12px',
                                  borderRadius: '8px',
                                  background: '#fff7ed',
                                  color: '#9a3412',
                                  border: '1px solid #fdba74',
                                  fontSize: '13px'
                                }}
                              >
                                {batchLinkUnavailableReason}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


