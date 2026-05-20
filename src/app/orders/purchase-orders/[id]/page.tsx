import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { PurchaseOrderDetailScreen } from '@/features/orders/screens/PurchaseOrderDetailScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function PurchaseOrderDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <PurchaseOrderDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}