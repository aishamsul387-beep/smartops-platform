import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { GRNCreateScreen } from '@/features/orders/screens/GRNCreateScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function GoodsReceivedNotesCreatePage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_MANAGE]}>
      <GRNCreateScreen />
    </ProtectedLayout>
  );
}