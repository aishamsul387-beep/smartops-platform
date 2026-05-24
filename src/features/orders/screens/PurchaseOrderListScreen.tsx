'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ordersApi } from '../api';
import { mapPurchaseOrder } from '../mapper';
import type { PurchaseOrderRecord, PurchaseOrderStatus } from '../types';

function getStatusStyle(status: PurchaseOrderStatus) {
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

export function PurchaseOrderListScreen() {
  const [items, setItems] = useState<PurchaseOrderRecord[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | PurchaseOrderStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(next?: { search?: string; status?: 'all' | PurchaseOrderStatus }) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ordersApi.getPurchaseOrders({
        search: next?.search ?? search,
        status: next?.status ?? status
      });

      setItems(response.map(mapPurchaseOrder));
    } catch (err: any) {
      setError(err?.message || 'Failed to load purchase orders');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load({ search: '', status: 'all' });
  }, []);

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
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              Purchase Orders
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Draft, issued, and received purchase orders including planning-generated traceability.
            </div>
          </div>

          <Link
            href="/orders/purchase-orders/create"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontWeight: 600
            }}
          >
            Create Purchase Order
          </Link>
        </div>
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
            <label htmlFor="po-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="po-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search PO no, supplier, item code, item name"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="po-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="po-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as 'all' | PurchaseOrderStatus)}
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
              <option value="issued">Issued</option>
              <option value="partially_received">Partially received</option>
              <option value="received">Received</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => void load()}
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
            Apply Filters
          </button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatus('all');
              void load({ search: '', status: 'all' });
            }}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Reset
          </button>
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
          <div style={{ padding: '24px', color: '#64748b' }}>Loading purchase orders...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No purchase orders found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>PO</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Supplier</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Planning Context</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Expected</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700 }}>{item.poNo}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{item.createdAt}</div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <div>{item.supplierName}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>
                        {item.itemCount} item line(s)
                      </div>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.planningContext ? (
                        <>
                          <div style={{ fontWeight: 700, color: '#1d4ed8' }}>Planning Generated</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {item.planningContext.itemCode} Â· {item.planningContext.itemName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Qty {item.planningContext.suggestedOrderQty} Â· Source {getSupplierSourceLabel(item.planningContext.supplierSource)}
                          </div>
                        </>
                      ) : (
                        <span style={{ color: '#64748b' }}>Manual / standard</span>
                      )}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.currency} {Number(item.totalAmount).toFixed(2)}
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {item.expectedDate}
                    </td>

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
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <Link href={`/orders/purchase-orders/${item.id}`} style={{ fontWeight: 600 }}>
                        View
                      </Link>
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