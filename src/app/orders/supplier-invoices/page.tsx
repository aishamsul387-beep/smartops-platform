import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { PERMISSIONS } from '@/types/permissions';

export default function SupplierInvoicesPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <div className="container">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Supplier Invoices</div>
          <div style={{ color: '#475569', lineHeight: 1.6 }}>
            Supplier invoices placeholder is ready. This route will be connected after quotation, PO, and GRN flow is stabilized.
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}