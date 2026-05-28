import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { BatchDetailScreen } from '@/features/batches/screens/BatchDetailScreen';

export default function BatchDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ProtectedLayout permissions={[]}>
      <BatchDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}