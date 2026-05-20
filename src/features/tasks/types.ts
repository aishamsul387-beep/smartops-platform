export type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface WarehouseTaskDto {
  id: string;
  title: string;
  type: string;
  description?: string;
  assignee: string;
  locationCode: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string;
  updatedAt: string;
}

export interface WarehouseTask {
  id: string;
  title: string;
  type: string;
  description: string;
  assignee: string;
  locationCode: string;
  status: TaskStatus;
  statusLabel: string;
  priority: TaskPriority;
  priorityLabel: string;
  dueAt: string;
  updatedAt: string;
  availableNextStatuses: TaskStatus[];
}

export interface TaskListFilters {
  search?: string;
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
}

export interface TaskListResponse {
  items: WarehouseTask[];
  total: number;
}

export interface TaskDetailResponse {
  item: WarehouseTask | null;
}

export interface UpdateTaskStatusRequest {
  id: string;
  status: TaskStatus;
}