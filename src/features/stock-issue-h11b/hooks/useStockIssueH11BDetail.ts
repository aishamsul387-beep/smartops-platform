'use client';

import { useEffect, useState } from 'react';
import { getH11BIssue, getH11BPrint } from '../api';
import { H11BIssueRecord } from '../types';

export function useStockIssueH11BDetail(issueId: string, printMode = false) {
  const [issue, setIssue] = useState<H11BIssueRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError('');
        const result = printMode ? await getH11BPrint(issueId) : await getH11BIssue(issueId);
        if (active) setIssue(result.issue);
      } catch (err: any) {
        if (active) setError(err?.message || 'Failed to load issue detail');
      } finally {
        if (active) setLoading(false);
      }
    }

    if (issueId) {
      run();
    }

    return () => {
      active = false;
    };
  }, [issueId, printMode]);

  return {
    issue,
    loading,
    error,
  };
}
