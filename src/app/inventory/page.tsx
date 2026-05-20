import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InventoryListScreen } from '@/features/inventory/screens/InventoryListScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function InventoryPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <InventoryListScreen />
    </ProtectedLayout>
  );
}