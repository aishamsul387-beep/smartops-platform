import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { QuotationsScreen } from '@/features/orders/screens/QuotationsScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function QuotationsPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <QuotationsScreen />
    </ProtectedLayout>
  );
}