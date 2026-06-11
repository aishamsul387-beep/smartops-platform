'use client';

import { useEffect, useState } from 'react';
import { getH11BContext } from '../api';
import { H11BContextResponse } from '../types';

const emptyContext: H11BContextResponse = {
  reasonCodes: [],
  warehouses: [],
  locations: [],
};

export function useStockIssueH11BContext() {
  const [data, setData] = useState<H11BContextResponse>(emptyContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError('');
        const response = await getH11BContext();
        if (active) setData(response);
      } catch (err: any) {
        if (active) setError(err?.message || 'Failed to load issue context');
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}
