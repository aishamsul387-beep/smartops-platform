import Link from 'next/link';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function StockIssueHistoryPage() {
  return (
    <ProtectedLayout permissions={[]}>
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
          <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
            Stock Issue History
          </div>
          <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            This route is reserved for future detailed stock issue history drill-down.
          </div>

          <Link
            href="/stock-issues"
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontWeight: 600
            }}
          >
            Back to Stock Issues
          </Link>
        </div>
      </div>
    </ProtectedLayout>
  );
}