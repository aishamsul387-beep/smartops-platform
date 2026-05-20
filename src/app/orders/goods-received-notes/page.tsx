import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { GRNScreen } from '@/features/orders/screens/GRNScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function GoodsReceivedNotesPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <GRNScreen />
    </ProtectedLayout>
  );
}