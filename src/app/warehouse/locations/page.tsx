import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { WarehouseLocationMasterScreen } from '@/features/warehouse/screens/WarehouseLocationMasterScreen';

export default function WarehouseLocationsPage() {
  return (
    <ProtectedLayout permissions={[]}>
      <WarehouseLocationMasterScreen />
    </ProtectedLayout>
  );
}