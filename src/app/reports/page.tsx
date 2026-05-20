import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { ReportsScreen } from '@/features/reports/screens/ReportsScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function ReportsPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.REPORTS_VIEW]}>
      <ReportsScreen />
    </ProtectedLayout>
  );
}