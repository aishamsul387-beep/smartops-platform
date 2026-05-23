'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useGRNDetail } from '../hooks/useGRNDetail';

function getStatusColor(status: string) {
  if (status === 'posted') {
    return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
  }

  return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
}

export function GRNDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = useGRNDetail(id);

  if (isLoading) {
    return <div className="container"><div style={{ padding: '24px', color: '#64748b' }}>Loading GRN...</div></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>
          <button
            type="button"
            onClick={() => void refresh()}
            style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>GRN not found</div>
          <Link href={ROUTES.goodsReceivedNotes} style={{ color: '#2563eb', fontWeight: 600 }}>Back to GRNs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>{item.grnNo}</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              GRN now supports batch traceability linkage into the batch control layer.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.goodsReceivedNotes} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to GRNs
            </Link>
            <Link href={ROUTES.batches} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#7c3aed', color: '#ffffff', fontWeight: 600 }}>
              Open batches
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>PO No</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.poNo}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Inventory Item</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.inventoryItemId}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Supplier</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.supplierName}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Batch Number</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.batchNumber}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Lot / Supplier Lot</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>
            {item.lotNumber || '-'} / {item.supplierLotNumber || '-'}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Received Lines / Qty</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>
            {item.receivedLines} / {item.receivedQty}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Status</div>
          <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
            {item.statusLabel}
          </span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Linked Batch ID</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{item.linkedBatchId || '-'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Date Tracking</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>
            Manufacture Date: <strong>{item.manufactureDate || '-'}</strong><br />
            Expiry Date: <strong>{item.expiryDate || '-'}</strong><br />
            Received Date: <strong>{item.receivedDate || '-'}</strong><br />
            Posted At: <strong>{new Date(item.postedAt).toLocaleString()}</strong>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Batch Storage Location</div>
          <div style={{ color: '#475569', lineHeight: 1.8 }}>
            Warehouse Location: <strong>{item.warehouseLocation || '-'}</strong><br />
            Zone: <strong>{item.zone || '-'}</strong><br />
            Aisle: <strong>{item.aisle || '-'}</strong><br />
            Level: <strong>{item.levelCode || '-'}</strong><br />
            Bin: <strong>{item.bin || '-'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}