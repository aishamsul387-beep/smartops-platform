import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { PurchaseOrdersScreen } from '@/features/orders/screens/PurchaseOrdersScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function PurchaseOrdersPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <PurchaseOrdersScreen />
    </ProtectedLayout>
  );
}