'use client';

import { useEffect, useState } from 'react';
import { listH11BIssues } from '../api';
import { H11BIssueRecord } from '../types';

export function useStockIssueH11BHistory() {
  const [items, setItems] = useState<H11BIssueRecord[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(nextQuery = query) {
    try {
      setLoading(true);
      setError('');
      const result = await listH11BIssues(nextQuery);
      setItems(result.items || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load issue history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load('');
  }, []);

  return {
    items,
    query,
    setQuery,
    load,
    loading,
    error,
  };
}
