'use client';

import { useEffect, useState } from 'react';
import { stockControlApi } from '../api';
import type {
  ProcurementQueueItem,
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
  reorderCandidates: 0,
  criticalReorderCount: 0,
  highReorderCount: 0,
  mediumReorderCount: 0,
  risingDemandItems: 0,
  stableDemandItems: 0,
  fallingDemandItems: 0,
  procurementDueToday: 0,
  procurementDueThisWeek: 0
};

export function useStockControl() {
  const [summary, setSummary] = useState<StockControlSummary>(initialSummary);
  const [alerts, setAlerts] = useState<StockControlAlert[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [procurementActions, setProcurementActions] = useState<ProcurementQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, alertData, reorderData, procurementData] = await Promise.all([
        stockControlApi.getSummary(),
        stockControlApi.getAlerts(),
        stockControlApi.getReorderSuggestions(),
        stockControlApi.getProcurementActions()
      ]);

      setSummary(summaryData);
      setAlerts(alertData);
      setReorderSuggestions(reorderData);
      setProcurementActions(procurementData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stock control data');
      setSummary(initialSummary);
      setAlerts([]);
      setReorderSuggestions([]);
      setProcurementActions([]);
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
    procurementActions,
    isLoading,
    error,
    refresh: load
  };
}