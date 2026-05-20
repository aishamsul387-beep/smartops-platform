import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { WarehouseScreen } from '@/features/warehouse/screens/WarehouseScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function WarehousePage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.WAREHOUSE_VIEW]}>
      <WarehouseScreen />
    </ProtectedLayout>
  );
}