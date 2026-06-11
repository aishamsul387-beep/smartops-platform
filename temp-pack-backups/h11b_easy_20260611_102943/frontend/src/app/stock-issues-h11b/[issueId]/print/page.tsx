import { StockIssueH11BPrintScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BPrintScreen';

export default function StockIssuesH11BPrintPage({
  params,
}: {
  params: { issueId: string };
}) {
  return <StockIssueH11BPrintScreen issueId={params.issueId} />;
}
