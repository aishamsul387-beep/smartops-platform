import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function WarehouseTasksPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.TASKS_VIEW]}>
      <TaskListScreen />
    </ProtectedLayout>
  );
}