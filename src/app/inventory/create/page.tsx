import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InventoryCreateScreen } from '@/features/inventory/screens/InventoryCreateScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function InventoryCreatePage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_MANAGE]}>
      <InventoryCreateScreen />
    </ProtectedLayout>
  );
}