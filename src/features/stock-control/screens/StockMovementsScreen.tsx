'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useStockMovements } from '../hooks/useStockMovements';

function formatMoney(value: number, currency: string) {
  return `${currency || 'USD'} ${Number(value || 0).toFixed(2)}`;
}

export function StockMovementsScreen() {
  const { items, isLoading, error, refresh } = useStockMovements();

  const summary = useMemo(() => {
    return {
      totalMovements: items.length,
      totalQtyIn: items.reduce((sum, item) => sum + item.qtyIn, 0),
      uniqueItems: new Set(items.map((item) => item.inventoryItemId)).size,
      uniqueBatches: new Set(items.map((item) => item.batchId)).size
    };
  }, [items]);

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
              Stock Movement Ledger
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Transaction traceability for receipts and batch-linked stock movements with SKU, barcode, product, and document references.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => void refresh()}
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

            <Link
              href="/stock-control"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to Stock Control
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Movements</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalMovements}</div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total Qty In</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.totalQtyIn}</div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Unique Items</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.uniqueItems}</div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Unique Batches</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{summary.uniqueBatches}</div>
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
          <div style={{ padding: '24px', color: '#64748b' }}>Loading stock movements...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No stock movements found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Barcode</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Product Name</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Batch</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qty In</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Qty Out</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PO / GRN</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.occurredAt}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.movementType}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {item.itemCode || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.barcode || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.itemName || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <Link href={`/batches/${item.batchId}`} style={{ color: '#2563eb' }}>
                        {item.batchNumber}
                      </Link>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.qtyIn}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.qtyOut}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.purchaseOrderNo || '-'} / {item.goodsReceivedNoteNo || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.supplierName || '-'}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.zone}-{item.aisle}-{item.levelCode}-{item.bin}
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