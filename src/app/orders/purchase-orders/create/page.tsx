import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { PurchaseOrderCreateScreen } from '@/features/orders/screens/PurchaseOrderCreateScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function PurchaseOrderCreatePage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_MANAGE]}>
      <PurchaseOrderCreateScreen />
    </ProtectedLayout>
  );
}