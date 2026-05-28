import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { StockMovementsScreen } from '@/features/stock-control/screens/StockMovementsScreen';

export default function StockMovementsPage() {
  return (
    <ProtectedLayout permissions={[]}>
      <StockMovementsScreen />
    </ProtectedLayout>
  );
}