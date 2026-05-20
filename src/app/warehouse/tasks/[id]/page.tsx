import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { TaskDetailScreen } from '@/features/tasks/screens/TaskDetailScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function WarehouseTaskDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.TASKS_VIEW]}>
      <TaskDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}