'use client';

import Link from 'next/link';
import { useStockIssueH11BHistory } from '../hooks/useStockIssueH11BHistory';

export function StockIssueH11BHistoryScreen() {
  const { items, query, setQuery, load, loading, error } = useStockIssueH11BHistory();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>H11-B Issue History</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Sandbox issue document history</p>
        </div>
        <Link href="/stock-issues-h11b">Create Issue</Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            style={{ flex: 1, padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by issue number, product, sku, barcode"
          />
          <button onClick={() => load(query)}>Search</button>
        </div>

        {error && <div style={{ color: '#991b1b', marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Issue No</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Product</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Reason</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Warehouse</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Issued Qty</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Created At</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.issueNumber}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.productName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.reasonCode}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                    {[item.warehouseName, item.locationName].filter(Boolean).join(' / ')}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.issuedQty}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/stock-issues-h11b/${item.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
