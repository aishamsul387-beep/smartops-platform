import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { AIAssistantScreen } from '@/features/ai-assistant/screens/AIAssistantScreen';
import { PERMISSIONS } from '@/types/permissions';

export default function AIAssistantPage() {
  return (
    <ProtectedLayout permissions={[PERMISSIONS.AI_USE]}>
      <AIAssistantScreen />
    </ProtectedLayout>
  );
}