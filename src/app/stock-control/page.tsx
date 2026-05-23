import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { StockControlScreen } from '@/features/stock-control/screens/StockControlScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function StockControlPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.INVENTORY_VIEW]}>
      <StockControlScreen />
    </ProtectedLayout>
  );
}