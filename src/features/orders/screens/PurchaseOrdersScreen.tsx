'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';

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

export function PurchaseOrdersScreen() {
  const { items, filters, isLoading, error, updateSearch, updateStatus, refresh } =
    usePurchaseOrders();

  return (
    <div className="container">
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Purchase Orders</div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Purchase order list foundation is ready for create, detail, and later receiving flow.
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
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Items</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Expected</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      <Link href={ROUTES.purchaseOrderDetail(item.id)} style={{ color: '#2563eb' }}>
                        {item.poNo}
                      </Link>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.supplierName}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.quotationNo || '-'}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.itemCount}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.currency} {item.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{new Date(item.expectedDate).toLocaleDateString()}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getStatusColor(item.status) }}>
                        {item.statusLabel}
                      </span>
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