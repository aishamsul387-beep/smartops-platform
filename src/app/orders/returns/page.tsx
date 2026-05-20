import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { PERMISSIONS } from '@/types/permissions';

export default function ReturnsPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Returns</div>
          <div style={{ color: '#475569', lineHeight: 1.6 }}>
            Returns placeholder is ready. Stock impact and linked credit note flow will be added in a later pack.
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}