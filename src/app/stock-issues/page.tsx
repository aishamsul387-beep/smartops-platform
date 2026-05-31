import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { StockIssueScreen } from '@/features/stock-issue/screens/StockIssueScreen';

export default function StockIssuesPage() {
  return (
    <ProtectedLayout permissions={[]}>
      <StockIssueScreen />
    </ProtectedLayout>
  );
}