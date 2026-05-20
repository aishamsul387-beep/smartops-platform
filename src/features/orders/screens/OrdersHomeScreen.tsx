'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/routes';
import { ordersApi } from '../api';
import type { OrdersDashboardSummary } from '../types';

const initialSummary: OrdersDashboardSummary = {
  quotations: 0,
  purchaseOrders: 0,
  goodsReceivedNotes: 0,
  pendingReceipts: 0
};

export function OrdersHomeScreen() {
  const [summary, setSummary] = useState<OrdersDashboardSummary>(initialSummary);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      setIsLoading(true);
      setSummary(await ordersApi.getOrdersDashboardSummary());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const cards = [
    {
      title: 'Quotations',
      value: summary.quotations,
      href: ROUTES.quotations,
      description: 'Supplier quotation list foundation'
    },
    {
      title: 'Purchase Orders',
      value: summary.purchaseOrders,
      href: ROUTES.purchaseOrders,
      description: 'Issue and track procurement orders'
    },
    {
      title: 'Goods Received Notes',
      value: summary.goodsReceivedNotes,
      href: ROUTES.goodsReceivedNotes,
      description: 'Receive and post inbound goods'
    },
    {
      title: 'Pending Receipts',
      value: summary.pendingReceipts,
      href: ROUTES.goodsReceivedNotes,
      description: 'Orders still waiting for full receipt'
    }
  ];

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
        <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Orders</div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          Sprint 4 procurement foundation is ready. Start from quotations, purchase orders, and
          goods received notes before moving to invoices, credit notes, and returns.
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#64748b' }}>Loading procurement summary...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}
            >
              <div style={{ color: '#64748b', marginBottom: '8px' }}>{card.title}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                {card.value}
              </div>
              <div style={{ color: '#475569', minHeight: '48px' }}>{card.description}</div>
              <Link
                href={card.href}
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  color: '#2563eb',
                  fontWeight: 600
                }}
              >
                Open →
              </Link>
            </div>
          ))}
        </div>
      )}

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
          Next procurement pages already reserved
        </div>
        <div style={{ display: 'grid', gap: '10px', color: '#475569' }}>
          <Link href={ROUTES.supplierInvoices}>Supplier invoices</Link>
          <Link href={ROUTES.supplierCreditNotes}>Supplier credit notes</Link>
          <Link href={ROUTES.returns}>Returns</Link>
        </div>
      </div>
    </div>
  );
}