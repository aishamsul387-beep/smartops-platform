import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InventoryEditScreen } from '@/features/inventory/screens/InventoryEditScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function InventoryEditPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_MANAGE]}>
      <InventoryEditScreen id={params.id} />
    </ProtectedLayout>
  );
}