'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ordersApi } from '../api';
import { useGRNDetail } from '../hooks/useGRNDetail';
import { useGRNInventorySummary } from '../hooks/useGRNInventorySummary';

function DetailCard({
  label,
  value
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700 }}>
        {value === null || value === undefined || value === '' ? '-' : value}
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

function getStatusStyle(status: string) {
  if (status === 'posted') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    };
  }

  return {
    background: '#e2e8f0',
    color: '#334155',
    border: '1px solid #cbd5e1'
  };
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

export function GRNDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = useGRNDetail(id);
  const {
    item: inventoryItem,
    isLoading: isInventoryLoading,
    error: inventoryError
  } = useGRNInventorySummary(item?.inventoryItemId || '');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  async function handlePost() {
    if (!item) {
      return;
    }

    try {
      setIsPosting(true);
      setActionError(null);
      await ordersApi.postGRN(item.id);
      await refresh();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to post GRN');
    } finally {
      setIsPosting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading GRN...</div>
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
            {error || 'GRN not found'}
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

  const linkedBatchFallback =
    item.status === 'draft'
      ? 'Batch link will become available after this GRN is posted.'
      : 'No linked batch is currently recorded for this GRN.';

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
              {item.grnNo}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              GRN now supports PO-line traceability, receipt context, inventory identity visibility.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/orders/goods-received-notes"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to GRNs
            </Link>

            <Link
              href="/batches"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#7c3aed',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Open batches
            </Link>

            {item.status === 'draft' ? (
              <button
                type="button"
                onClick={() => void handlePost()}
                disabled={isPosting}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isPosting ? '#94a3b8' : '#0f172a',
                  color: '#ffffff',
                  cursor: isPosting ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {isPosting ? 'Posting GRN...' : 'Post GRN'}
              </button>
            ) : null}

            {item.linkedBatchId ? (
              <Link
                href={`/batches/${item.linkedBatchId}`}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600
                }}
              >
                Open linked batch
              </Link>
            ) : null}
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

        {item.status === 'posted' ? (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>
              GRN posting complete
            </div>
            <div style={{ lineHeight: 1.6, marginBottom: '12px' }}>
              This GRN is now posted. Continue to the linked batch, return to receiving review, or move back into purchase order follow-up.
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {item.linkedBatchId ? (
                <Link
                  href={`/batches/${item.linkedBatchId}`}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  Open linked batch
                </Link>
              ) : (
                <span
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px dashed #6ee7b7',
                    background: '#ffffff',
                    color: '#047857',
                    fontWeight: 600
                  }}
                >
                  Linked batch unavailable
                </span>
              )}

              <Link
                href="/orders/goods-received-notes"
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #a7f3d0',
                  background: '#ffffff',
                  color: '#065f46',
                  fontWeight: 600
                }}
              >
                Back to GRN list
              </Link>

              <Link
                href="/orders/purchase-orders"
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #a7f3d0',
                  background: '#ffffff',
                  color: '#065f46',
                  fontWeight: 600
                }}
              >
                Open Purchase Orders
              </Link>

              <Link
                href="/batches"
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #a7f3d0',
                  background: '#ffffff',
                  color: '#065f46',
                  fontWeight: 600
                }}
              >
                Open Batch Control
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>
              Draft GRN next step
            </div>
            <div style={{ lineHeight: 1.6 }}>
              Post this GRN to complete receiving, create/link the batch, and unlock direct batch drill-down from this screen and related PO receipt history.
            </div>
          </div>
        )}
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
          label="GRN No"
          value={item.grnNo}
          copied={copiedKey === 'grnNo'}
          onCopy={() => void handleCopy('grnNo', item.grnNo)}
        />
        <CopyReferenceCard
          label="PO No"
          value={item.poNo}
          copied={copiedKey === 'poNo'}
          onCopy={() => void handleCopy('poNo', item.poNo)}
        />
        <CopyReferenceCard
          label="Linked Batch ID"
          value={item.linkedBatchId}
          copied={copiedKey === 'linkedBatchId'}
          onCopy={() => void handleCopy('linkedBatchId', item.linkedBatchId)}
        />
        <CopyReferenceCard
          label="Inventory Item ID"
          value={item.inventoryItemId}
          copied={copiedKey === 'inventoryItemId'}
          onCopy={() => void handleCopy('inventoryItemId', item.inventoryItemId)}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <DetailCard label="PO No" value={item.poNo} />
        <DetailCard label="PO Line ID" value={item.purchaseOrderLineId} />
        <DetailCard label="Inventory Item" value={item.inventoryItemId} />
        <DetailCard label="SKU" value={inventoryItem?.sku || (isInventoryLoading ? 'Loading...' : '-')} />
        <DetailCard label="Barcode" value={inventoryItem?.barcode || (isInventoryLoading ? 'Loading...' : '-')} />
        <DetailCard label="Supplier" value={item.supplierName} />
        <DetailCard label="Batch Number" value={item.batchNumber} />
        <DetailCard label="Received Qty" value={item.receivedQty} />
      </div>

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
            GRN Details
          </div>
          <DetailRow label="GRN No" value={item.grnNo} />
          <DetailRow label="PO No" value={item.poNo} />
          <DetailRow label="PO Line ID" value={item.purchaseOrderLineId} />
          <DetailRow label="Inventory Item" value={item.inventoryItemId} />
          <DetailRow label="Supplier" value={item.supplierName} />
          <DetailRow label="Batch Number" value={item.batchNumber} />
          <DetailRow label="Lot Number" value={item.lotNumber} />
          <DetailRow label="Supplier Lot Number" value={item.supplierLotNumber} />
          <DetailRow label="Received Lines" value={item.receivedLines} />
          <DetailRow label="Received Qty" value={item.receivedQty} />
          <DetailRow label="Linked Batch ID" value={item.linkedBatchId} />

          {item.linkedBatchId ? (
            <div style={{ marginTop: '12px' }}>
              <Link href={`/batches/${item.linkedBatchId}`} style={{ color: '#7c3aed', fontWeight: 600 }}>
                Open linked batch detail
              </Link>
            </div>
          ) : (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#fff7ed',
                color: '#9a3412',
                border: '1px solid #fdba74',
                fontSize: '13px'
              }}
            >
              {linkedBatchFallback}
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
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
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Date Tracking
          </div>
          <DetailRow label="Manufacture Date" value={formatDate(item.manufactureDate)} />
          <DetailRow label="Expiry Date" value={formatDate(item.expiryDate)} />
          <DetailRow label="Received Date" value={formatDate(item.receivedDate)} />
          <DetailRow label="Posted At" value={formatDate(item.postedAt)} />
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Batch Storage Location
          </div>
          <DetailRow label="Warehouse Location" value={item.warehouseLocation} />
          <DetailRow label="Zone" value={item.zone} />
          <DetailRow label="Aisle" value={item.aisle} />
          <DetailRow label="Level" value={item.levelCode} />
          <DetailRow label="Bin" value={item.bin} />
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Purchase Order Line Context
          </div>

          {item.purchaseOrderLineContext ? (
            <>
              <DetailRow label="Line No" value={item.purchaseOrderLineContext.lineNo} />
              <DetailRow label="Item Code" value={item.purchaseOrderLineContext.itemCode} />
              <DetailRow label="Item Name" value={item.purchaseOrderLineContext.itemName} />
              <DetailRow label="Ordered Qty" value={item.purchaseOrderLineContext.orderedQty} />
              <DetailRow label="Received Qty" value={item.purchaseOrderLineContext.receivedQty} />
              <DetailRow label="Remaining Qty" value={item.purchaseOrderLineContext.remainingQty} />
              <DetailRow
                label="Unit Cost"
                value={`${item.purchaseOrderLineContext.currency} ${Number(item.purchaseOrderLineContext.unitCost).toFixed(2)}`}
              />
              <DetailRow
                label="Line Total"
                value={`${item.purchaseOrderLineContext.currency} ${Number(item.purchaseOrderLineContext.lineTotal).toFixed(2)}`}
              />
              <DetailRow label="Notes" value={item.purchaseOrderLineContext.notes} />
            </>
          ) : (
            <div style={{ color: '#64748b' }}>No purchase order line context available.</div>
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
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Inventory Master Snapshot
          </div>

          {inventoryError ? (
            <div style={{ color: '#b91c1c' }}>{inventoryError}</div>
          ) : inventoryItem ? (
            <>
              <DetailRow label="SKU" value={inventoryItem.sku} />
              <DetailRow label="Barcode" value={inventoryItem.barcode} />
              <DetailRow label="Name" value={inventoryItem.name} />
              <DetailRow label="Category" value={inventoryItem.category} />
              <DetailRow label="Item Type" value={inventoryItem.itemType} />
              <DetailRow label="Brand" value={inventoryItem.brand} />
              <DetailRow label="Model" value={inventoryItem.model} />
              <DetailRow label="Preferred Supplier" value={inventoryItem.preferredSupplierName} />
              <DetailRow label="Standard Cost" value={`${inventoryItem.currency} ${Number(inventoryItem.standardCost).toFixed(2)}`} />
              <DetailRow label="Average Cost" value={`${inventoryItem.currency} ${Number(inventoryItem.averageCost).toFixed(2)}`} />
            </>
          ) : (
            <div style={{ color: '#64748b' }}>
              {isInventoryLoading ? 'Loading inventory snapshot...' : 'Inventory snapshot not found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

