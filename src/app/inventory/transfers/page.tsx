import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InventoryTransferScreen } from '@/features/inventory/screens/InventoryTransferScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function InventoryTransfersPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <InventoryTransferScreen />
    </ProtectedLayout>
  );
}
