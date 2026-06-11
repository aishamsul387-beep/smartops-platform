import { StockIssueH11BDetailScreen } from '@/features/stock-issue-h11b/screens/StockIssueH11BDetailScreen';

export default function StockIssuesH11BDetailPage({
  params,
}: {
  params: { issueId: string };
}) {
  return <StockIssueH11BDetailScreen issueId={params.issueId} />;
}
