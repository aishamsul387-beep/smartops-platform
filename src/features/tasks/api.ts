import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import { getNextTaskStatuses, mapWarehouseTask } from './mapper';
import type {
  TaskListFilters,
  TaskListResponse,
  TaskStatus,
  WarehouseTask,
  WarehouseTaskDto
} from './types';

type TaskDetailDto = WarehouseTaskDto & {
  availableNextStatuses?: TaskStatus[];
};

export const tasksApi = {
  async getTaskList(filters?: TaskListFilters): Promise<TaskListResponse> {
    const response = await apiClient.get<WarehouseTaskDto[]>(ENDPOINTS.tasks.list, {
      query: {
        search: filters?.search || '',
        status: filters?.status || 'all',
        priority: filters?.priority || 'all'
      }
    });

    const items = (response.data || []).map(mapWarehouseTask);

    return {
      items,
      total: items.length
    };
  },

  async getTaskById(id: string): Promise<{ item: WarehouseTask | null }> {
    const response = await apiClient.get<TaskDetailDto>(ENDPOINTS.tasks.detail(id));

    if (!response.data) {
      return { item: null };
    }

    const mapped = mapWarehouseTask(response.data);

    return {
      item: {
        ...mapped,
        availableNextStatuses:
          response.data.availableNextStatuses ?? getNextTaskStatuses(mapped.status)
      }
    };
  },

  async updateTaskStatus(payload: { id: string; status: TaskStatus }): Promise<WarehouseTask> {
    const response = await apiClient.patch<TaskDetailDto>(
      ENDPOINTS.tasks.updateStatus(payload.id),
      { status: payload.status }
    );

    const mapped = mapWarehouseTask(response.data);

    return {
      ...mapped,
      availableNextStatuses:
        response.data.availableNextStatuses ?? getNextTaskStatuses(mapped.status)
    };
  }
};