'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStockIssueH11BDetail } from '../hooks/useStockIssueH11BDetail';

export function StockIssueH11BPrintScreen({ issueId }: { issueId: string }) {
  const { issue, loading, error } = useStockIssueH11BDetail(issueId, true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', color: '#111827' }}>
      <div style={{ marginBottom: 16 }}>
        <Link href={`/stock-issues-h11b/${issueId}`}>Back to Detail</Link>
      </div>

      {loading && <p>Loading print view...</p>}
      {error && <div style={{ color: '#991b1b' }}>{error}</div>}

      {issue && (
        <>
          <h1>Stock Issue Slip</h1>
          <p><strong>Issue Number:</strong> {issue.issueNumber}</p>
          <p><strong>Date:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          <p><strong>Actor:</strong> {issue.actorName || '-'}</p>
          <hr />
          <p><strong>Product:</strong> {issue.productName}</p>
          <p><strong>SKU:</strong> {issue.sku || '-'}</p>
          <p><strong>Barcode:</strong> {issue.barcode || '-'}</p>
          <p><strong>Requested Qty:</strong> {issue.requestedQty}</p>
          <p><strong>Issued Qty:</strong> {issue.issuedQty}</p>
          <p><strong>Reason:</strong> {issue.reasonCode}</p>
          <p><strong>Warehouse:</strong> {issue.warehouseName || '-'}</p>
          <p><strong>Location:</strong> {issue.locationName || '-'}</p>
          <p><strong>Remarks:</strong> {issue.remarks || '-'}</p>

          <h2>Allocations</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #111', padding: 8 }}>Batch</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #111', padding: 8 }}>Expiry</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #111', padding: 8 }}>Allocated</th>
              </tr>
            </thead>
            <tbody>
              {issue.allocations.map((item) => (
                <tr key={item.batchId}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{item.batchNumber}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{item.expiryDate || '-'}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: 8, textAlign: 'right' }}>{item.allocatedQty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div style={{ borderTop: '1px solid #111', paddingTop: 8 }}>Prepared By</div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #111', paddingTop: 8 }}>Received By</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
