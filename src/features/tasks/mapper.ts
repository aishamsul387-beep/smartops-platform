import type {
  TaskPriority,
  TaskStatus,
  WarehouseTask,
  WarehouseTaskDto
} from './types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  blocked: 'Blocked',
  completed: 'Completed'
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const NEXT_STATUS_MAP: Record<TaskStatus, TaskStatus[]> = {
  pending: ['in_progress', 'blocked', 'completed'],
  in_progress: ['blocked', 'completed'],
  blocked: ['in_progress', 'completed'],
  completed: []
};

export function getTaskStatusLabel(status: TaskStatus) {
  return STATUS_LABELS[status];
}

export function getTaskPriorityLabel(priority: TaskPriority) {
  return PRIORITY_LABELS[priority];
}

export function getNextTaskStatuses(status: TaskStatus) {
  return NEXT_STATUS_MAP[status];
}

export function mapWarehouseTask(dto: WarehouseTaskDto): WarehouseTask {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type,
    description: dto.description || 'No additional task description provided yet.',
    assignee: dto.assignee,
    locationCode: dto.locationCode,
    status: dto.status,
    statusLabel: getTaskStatusLabel(dto.status),
    priority: dto.priority,
    priorityLabel: getTaskPriorityLabel(dto.priority),
    dueAt: dto.dueAt,
    updatedAt: dto.updatedAt,
    availableNextStatuses: getNextTaskStatuses(dto.status)
  };
}