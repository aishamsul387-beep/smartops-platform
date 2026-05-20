import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { GRNDetailScreen } from '@/features/orders/screens/GRNDetailScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function GoodsReceivedNotesDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.ORDERS_VIEW]}>
      <GRNDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}