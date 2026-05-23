'use client';

import { useEffect, useState } from 'react';
import { stockControlApi } from '../api';
import type {
  ReorderSuggestion,
  StockControlAlert,
  StockControlSummary
} from '../types';

const initialSummary: StockControlSummary = {
  totalItems: 0,
  totalOnHandQty: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
  overstockItems: 0,
  expiringSoonBatches: 0,
  expiredBatches: 0,
  reorderCandidates: 0
};

export function useStockControl() {
  const [summary, setSummary] = useState<StockControlSummary>(initialSummary);
  const [alerts, setAlerts] = useState<StockControlAlert[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, alertData, reorderData] = await Promise.all([
        stockControlApi.getSummary(),
        stockControlApi.getAlerts(),
        stockControlApi.getReorderSuggestions()
      ]);

      setSummary(summaryData);
      setAlerts(alertData);
      setReorderSuggestions(reorderData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stock control data');
      setSummary(initialSummary);
      setAlerts([]);
      setReorderSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return {
    summary,
    alerts,
    reorderSuggestions,
    isLoading,
    error,
    refresh: load
  };
}