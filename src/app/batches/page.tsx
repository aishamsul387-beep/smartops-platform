import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { BatchListScreen } from '@/features/batches/screens/BatchListScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function BatchesPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <BatchListScreen />
    </ProtectedLayout>
  );
}