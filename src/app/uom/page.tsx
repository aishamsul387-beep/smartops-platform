import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { UomScreen } from '@/features/uom/screens/UomScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function UomPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <UomScreen />
    </ProtectedLayout>
  );
}