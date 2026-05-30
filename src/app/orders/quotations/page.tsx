import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { QuotationListScreen } from '@/features/orders/screens/QuotationListScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function QuotationsPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <QuotationListScreen />
    </ProtectedLayout>
  );
}
