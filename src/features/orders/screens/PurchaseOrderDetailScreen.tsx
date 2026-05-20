'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { usePurchaseOrderDetail } from '../hooks/usePurchaseOrderDetail';

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

export function PurchaseOrderDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = usePurchaseOrderDetail(id);

  if (isLoading) {
    return <div className="container"><div style={{ padding: '24px', color: '#64748b' }}>Loading purchase order...</div></div>;
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
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Purchase order not found</div>
          <Link href={ROUTES.purchaseOrders} style={{ color: '#2563eb', fontWeight: 600 }}>Back to purchase orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>{item.poNo}</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Purchase order detail foundation is ready for later GRN linkage and procurement workflow expansion.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={ROUTES.purchaseOrders} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 600 }}>
              Back to purchase orders
            </Link>
            <Link href={ROUTES.goodsReceivedNotesCreate} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: '#0f766e', color: '#ffffff', fontWeight: 600 }}>
              Create GRN
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Supplier</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.supplierName}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Quotation</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.quotationNo || '-'}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Items</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.itemCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Amount</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.currency} {item.totalAmount.toLocaleString()}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Expected Date</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{new Date(item.expectedDate).toLocaleDateString()}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Status</div>
          <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
            {item.statusLabel}
          </span>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
        <div style={{ color: '#64748b', marginBottom: '8px' }}>Created</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{new Date(item.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}