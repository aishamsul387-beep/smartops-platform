import { getNextTaskStatuses, mapWarehouseTask } from './mapper';
import type {
  TaskDetailResponse,
  TaskListFilters,
  TaskListResponse,
  UpdateTaskStatusRequest,
  WarehouseTaskDto
} from './types';

let mockTasks: WarehouseTaskDto[] = [
  {
    id: 'task-001',
    title: 'Put away steel sheet batch',
    type: 'Putaway',
    description:
      'Move inbound steel sheet batch from staging area to the assigned rack location and confirm space allocation.',
    assignee: 'Operator User',
    locationCode: 'A-01-01',
    status: 'pending',
    priority: 'high',
    dueAt: '2026-05-21T14:00:00.000Z',
    updatedAt: '2026-05-21T10:20:00.000Z'
  },
  {
    id: 'task-002',
    title: 'Cycle count packaging bin',
    type: 'Cycle Count',
    description:
      'Perform count verification on packaging bin B-02-04 and compare physical quantity against expected quantity.',
    assignee: 'Manager User',
    locationCode: 'B-02-04',
    status: 'in_progress',
    priority: 'medium',
    dueAt: '2026-05-21T16:00:00.000Z',
    updatedAt: '2026-05-21T10:45:00.000Z'
  },
  {
    id: 'task-003',
    title: 'Investigate blocked valve replenishment',
    type: 'Replenishment',
    description:
      'Task is blocked until receiving discrepancy is reviewed and released by supervisor.',
    assignee: 'Admin User',
    locationCode: 'C-03-02',
    status: 'blocked',
    priority: 'high',
    dueAt: '2026-05-21T18:30:00.000Z',
    updatedAt: '2026-05-21T11:10:00.000Z'
  },
  {
    id: 'task-004',
    title: 'Complete goods staging verification',
    type: 'Staging',
    description:
      'Final staging verification for outbound lane before dispatch confirmation.',
    assignee: 'Viewer User',
    locationCode: 'D-01-05',
    status: 'completed',
    priority: 'low',
    dueAt: '2026-05-21T12:00:00.000Z',
    updatedAt: '2026-05-21T09:50:00.000Z'
  }
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: WarehouseTaskDto[], filters?: TaskListFilters) {
  const search = filters?.search?.trim().toLowerCase();
  const status = filters?.status;
  const priority = filters?.priority;

  return items.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.assignee.toLowerCase().includes(search) ||
      item.locationCode.toLowerCase().includes(search);

    const matchesStatus = !status || status === 'all' || item.status === status;
    const matchesPriority = !priority || priority === 'all' || item.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

export const tasksApi = {
  async getTaskList(filters?: TaskListFilters): Promise<TaskListResponse> {
    await delay(180);

    const items = applyFilters(mockTasks, filters).map(mapWarehouseTask);

    return {
      items,
      total: items.length
    };
  },

  async getTaskById(id: string): Promise<TaskDetailResponse> {
    await delay(150);

    const found = mockTasks.find((item) => item.id === id);

    return {
      item: found ? mapWarehouseTask(found) : null
    };
  },

  async updateTaskStatus(payload: UpdateTaskStatusRequest) {
    await delay(160);

    const current = mockTasks.find((item) => item.id === payload.id);

    if (!current) {
      throw new Error('Task not found');
    }

    const allowed = getNextTaskStatuses(current.status);

    if (!allowed.includes(payload.status)) {
      throw new Error(`Invalid transition from ${current.status} to ${payload.status}`);
    }

    const updatedTask: WarehouseTaskDto = {
      ...current,
      status: payload.status,
      updatedAt: new Date().toISOString()
    };

    mockTasks = mockTasks.map((item) => (item.id === payload.id ? updatedTask : item));

    return mapWarehouseTask(updatedTask);
  }
};