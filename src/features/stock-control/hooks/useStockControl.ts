'use client';

import { useEffect, useState } from 'react';
import { stockControlApi } from '../api';
import type { StockControlAlert, StockControlSummary } from '../types';

const initialSummary: StockControlSummary = {
  totalItems: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
  overstockItems: 0,
  expiringSoonBatches: 0,
  expiredBatches: 0
};

export function useStockControl() {
  const [summary, setSummary] = useState<StockControlSummary>(initialSummary);
  const [alerts, setAlerts] = useState<StockControlAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, alertData] = await Promise.all([
        stockControlApi.getSummary(),
        stockControlApi.getAlerts()
      ]);

      setSummary(summaryData);
      setAlerts(alertData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stock control data');
      setSummary(initialSummary);
      setAlerts([]);
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
    isLoading,
    error,
    refresh: load
  };
}