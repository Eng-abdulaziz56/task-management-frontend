import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask 
} from './index';
import type { 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  GetTasksQueryParams 
} from './types';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: GetTasksQueryParams | undefined) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Get all tasks hook
export function useTasks(filters?: GetTasksQueryParams) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single task hook
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create task hook
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast({
        title: 'Success',
        variant: "success",
        description: `${data.message || 'Task created successfully'} • 📧 Email notification sent`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });
}

// Update task hook
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      updateTask(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
      toast({
        title: 'Success',
        variant: "success",
        description: `${data.message || 'Task updated successfully'} • 📧 Email notification sent`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });
}

// Delete task hook
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast({
        title: 'Success',
        variant: "success",
        description: `${data.message || 'Task deleted successfully'} • 📧 Email notification sent`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete task',
        variant: 'destructive',
      });
    }, 
  });
} 