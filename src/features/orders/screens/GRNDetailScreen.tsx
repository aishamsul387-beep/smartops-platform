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
              GRN detail foundation is ready for later posting and inventory impact logic.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.goodsReceivedNotes} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to GRNs
            </Link>
            <Link href={ROUTES.purchaseOrders} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f766e', color: '#ffffff', fontWeight: 600 }}>
              View purchase orders
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
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Supplier</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.supplierName}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Received Lines</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.receivedLines}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Received Qty</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.receivedQty}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Status</div>
          <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
            {item.statusLabel}
          </span>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
        <div style={{ color: '#64748b', marginBottom: '8px' }}>Posted At</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{new Date(item.postedAt).toLocaleString()}</div>
      </div>
    </div>
  );
}