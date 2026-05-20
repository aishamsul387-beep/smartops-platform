import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { WarehouseLocationsScreen } from '@/features/warehouse/screens/WarehouseLocationsScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function WarehouseLocationsPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.WAREHOUSE_VIEW]}>
      <WarehouseLocationsScreen />
    </ProtectedLayout>
  );
}