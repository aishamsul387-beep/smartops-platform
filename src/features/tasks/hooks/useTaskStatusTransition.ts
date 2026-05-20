'use client';

import { useState } from 'react';
import { tasksApi } from '../api';
import type { TaskStatus, WarehouseTask } from '../types';

export function useTaskStatusTransition() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function transitionTask(id: string, status: TaskStatus): Promise<WarehouseTask> {
    try {
      setIsSubmitting(true);
      setError(null);

      return await tasksApi.updateTaskStatus({ id, status });
    } catch (err: any) {
      setError(err?.message || 'Failed to update task status');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearTransitionError() {
    setError(null);
  }

  return {
    transitionTask,
    isSubmitting,
    error,
    clearTransitionError
  };
}