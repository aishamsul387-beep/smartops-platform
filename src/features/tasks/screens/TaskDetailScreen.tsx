'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { getTaskStatusLabel } from '../mapper';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { useTaskStatusTransition } from '../hooks/useTaskStatusTransition';
import type { TaskStatus } from '../types';

function getStatusColor(status: string) {
  if (status === 'pending') {
    return {
      background: '#e0f2fe',
      color: '#075985',
      border: '1px solid #bae6fd'
    };
  }

  if (status === 'in_progress') {
    return {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    };
  }

  if (status === 'blocked') {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    };
  }

  return {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  };
}

function getPriorityColor(priority: string) {
  if (priority === 'high') {
    return '#b91c1c';
  }

  if (priority === 'medium') {
    return '#92400e';
  }

  return '#166534';
}

export function TaskDetailScreen({ id }: { id: string }) {
  const { item, isLoading, error, refresh } = useTaskDetail(id);
  const { transitionTask, isSubmitting, error: transitionError, clearTransitionError } =
    useTaskStatusTransition();

  async function handleTransition(nextStatus: TaskStatus) {
    if (!item) {
      return;
    }

    try {
      clearTransitionError();
      await transitionTask(item.id, nextStatus);
      await refresh();
    } catch {
      // handled by hook state
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: '24px', color: '#64748b' }}>Loading task detail...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>
          <button
            type="button"
            onClick={() => void refresh()}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '24px'
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Task not found
          </div>
          <div style={{ color: '#475569', marginBottom: '16px' }}>
            The requested task could not be found in the current mock task store.
          </div>
          <Link href={ROUTES.warehouseTasks} style={{ color: '#2563eb', fontWeight: 600 }}>
            Back to tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              {item.title}
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Task detail and status transition foundation is now ready for warehouse execution flow.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.warehouseTasks}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to tasks
            </Link>

            <button
              type="button"
              onClick={() => void refresh()}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Type</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.type}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Assignee</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.assignee}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Location</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{item.locationCode}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Priority</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: getPriorityColor(item.priority) }}>
            {item.priorityLabel}
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
          Current status
        </div>
        <span
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            ...getStatusColor(item.status)
          }}
        >
          {item.statusLabel}
        </span>

        <div style={{ marginTop: '20px', color: '#475569', lineHeight: 1.7 }}>
          {item.description}
        </div>

        <div style={{ marginTop: '20px', color: '#64748b' }}>
          <strong>Due:</strong> {new Date(item.dueAt).toLocaleString()}
          <br />
          <strong>Updated:</strong> {new Date(item.updatedAt).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
          Available status transitions
        </div>

        {transitionError ? (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca'
            }}
          >
            {transitionError}
          </div>
        ) : null}

        {item.availableNextStatuses.length === 0 ? (
          <div style={{ color: '#64748b' }}>
            No further transitions available. This task is already completed.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {item.availableNextStatuses.map((nextStatus) => (
              <button
                key={nextStatus}
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleTransition(nextStatus)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSubmitting ? '#94a3b8' : '#0f766e',
                  color: '#ffffff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Updating...' : `Move to ${getTaskStatusLabel(nextStatus)}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}