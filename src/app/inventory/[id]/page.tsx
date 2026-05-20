import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InventoryDetailScreen } from '@/features/inventory/screens/InventoryDetailScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function InventoryDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <InventoryDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}