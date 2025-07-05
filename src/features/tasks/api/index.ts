import api from '@/lib/api/api-interceptor';
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  GetTasksQueryParams, 
  ApiResponse 
} from './types';

const BASE_URL = '/tasks';

export async function getTasks(params?: GetTasksQueryParams): Promise<ApiResponse<Task[]>> {
  const queryParams = new URLSearchParams();
  
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.search) queryParams.append('search', params.search);
  
  const url = queryParams.toString() ? `${BASE_URL}?${queryParams.toString()}` : BASE_URL;
  const res = await api.get(url);
  return res.data;
}

// Get a single task by ID
export async function getTask(id: string): Promise<ApiResponse<Task>> {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data;
}

// Create a new task
export async function createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {

  const res = await api.post(BASE_URL, data);
  return res.data;
}

// Update an existing task
export async function updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
  const res = await api.put(`${BASE_URL}/${id}`, data);
  return res.data;
}

// Delete a task
export async function deleteTask(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete(`${BASE_URL}/${id}`);
  return res.data;
} 