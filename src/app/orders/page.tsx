import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { OrdersHomeScreen } from '@/features/orders/screens/OrdersHomeScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function OrdersPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <OrdersHomeScreen />
    </ProtectedLayout>
  );
}