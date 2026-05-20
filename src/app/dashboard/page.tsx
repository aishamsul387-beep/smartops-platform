import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function DashboardPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.DASHBOARD_VIEW]}>
      <DashboardScreen />
    </ProtectedLayout>
  );
}
