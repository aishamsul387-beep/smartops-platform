'use client';

import Link from 'next/link';
import { useStockIssueH11BDetail } from '../hooks/useStockIssueH11BDetail';

export function StockIssueH11BDetailScreen({ issueId }: { issueId: string }) {
  const { issue, loading, error } = useStockIssueH11BDetail(issueId);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>H11-B Issue Detail</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Issue ID: {issueId}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/stock-issues-h11b">Create</Link>
          <Link href="/stock-issues-h11b/history">History</Link>
          <Link href={`/stock-issues-h11b/${issueId}/print`}>Print</Link>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div style={{ color: '#991b1b' }}>{error}</div>}

      {issue && (
        <>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Header</h2>
            <p><strong>Issue Number:</strong> {issue.issueNumber}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Product:</strong> {issue.productName}</p>
            <p><strong>SKU:</strong> {issue.sku || '-'}</p>
            <p><strong>Barcode:</strong> {issue.barcode || '-'}</p>
            <p><strong>Requested Qty:</strong> {issue.requestedQty}</p>
            <p><strong>Issued Qty:</strong> {issue.issuedQty}</p>
            <p><strong>Reason:</strong> {issue.reasonCode}</p>
            <p><strong>Warehouse / Location:</strong> {[issue.warehouseName, issue.locationName].filter(Boolean).join(' / ')}</p>
            <p><strong>Remarks:</strong> {issue.remarks || '-'}</p>
            <p><strong>Actor:</strong> {issue.actorName || '-'}</p>
            <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Allocations</h2>
            {issue.allocations.length === 0 ? (
              <p>No allocations.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Batch</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Expiry</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Available</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Allocated</th>
                  </tr>
                </thead>
                <tbody>
                  {issue.allocations.map((item) => (
                    <tr key={item.batchId}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.batchNumber}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{item.expiryDate || '-'}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.availableQty}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{item.allocatedQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Movement References</h2>
            {issue.movementRefs.length === 0 ? (
              <p>No movement refs.</p>
            ) : (
              <ul>
                {issue.movementRefs.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
