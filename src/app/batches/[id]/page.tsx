import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { BatchDetailScreen } from '@/features/batches/screens/BatchDetailScreen';

type PageProps = {
  params: {
    id: string;
  };
};

export default function BatchDetailPage({ params }: PageProps) {
  return (
    <ProtectedLayout permissions={[]}>
      <BatchDetailScreen id={params.id} />
    </ProtectedLayout>
  );
}