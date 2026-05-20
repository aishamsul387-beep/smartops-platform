'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useTaskList } from '../hooks/useTaskList';

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

export function TaskListScreen() {
  const {
    items,
    filters,
    isLoading,
    error,
    pendingCount,
    blockedCount,
    updateSearch,
    updateStatus,
    updatePriority,
    refresh
  } = useTaskList();

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
              Warehouse Tasks
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Operational task list foundation is ready. Task detail and status transitions are now linked.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href={ROUTES.warehouse}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600
              }}
            >
              Back to warehouse
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
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Total visible tasks</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{items.length}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Pending</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{pendingCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Blocked</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{blockedCount}</div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <label htmlFor="task-search" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Search
            </label>
            <input
              id="task-search"
              value={filters.search || ''}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search title, type, assignee, location"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          <div>
            <label htmlFor="task-status" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Status
            </label>
            <select
              id="task-status"
              value={filters.status || 'all'}
              onChange={(event) =>
                updateStatus(
                  event.target.value as 'all' | 'pending' | 'in_progress' | 'blocked' | 'completed'
                )
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Priority
            </label>
            <select
              id="task-priority"
              value={filters.priority || 'all'}
              onChange={(event) =>
                updatePriority(event.target.value as 'all' | 'low' | 'medium' | 'high')
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '24px', color: '#64748b' }}>Loading tasks...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#b91c1c' }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '24px', color: '#64748b' }}>No tasks found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Assignee</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Priority</th>
                  <th style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                      <Link href={`/warehouse/tasks/${item.id}`} style={{ color: '#2563eb' }}>
                        {item.title}
                      </Link>
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.type}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.assignee}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.locationCode}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          ...getStatusColor(item.status)
                        }}
                      >
                        {item.statusLabel}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '14px',
                        borderBottom: '1px solid #e2e8f0',
                        color: getPriorityColor(item.priority),
                        fontWeight: 700
                      }}
                    >
                      {item.priorityLabel}
                    </td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>
                      {new Date(item.dueAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}