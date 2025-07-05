import type { ApiResponse as CommonApiResponse } from '@/common/types/api-response';

export type ApiResponse<T = unknown> = CommonApiResponse<T>;

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface UpdateTaskRequest extends CreateTaskRequest {}

export interface GetTasksQueryParams {
  priority?: TaskPriority;
  status?: TaskStatus;
  search?: string;
}

export interface ValidationError {
  [key: string]: string;
} 