import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../api/types';

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800', 
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'MEDIUM',
      status: task?.status || 'PENDING',
    },
  });

  const watchedPriority = watch('priority');
  const watchedStatus = watch('status');

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter task title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter task description (optional)"
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={watchedPriority}
            onValueChange={(value: string) => setValue('priority', value as 'LOW' | 'MEDIUM' | 'HIGH')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW" className="flex items-center gap-2">
                <Badge className={priorityColors.LOW} variant="secondary">
                  {priorityLabels.LOW}
                </Badge>
              </SelectItem>
              <SelectItem value="MEDIUM" className="flex items-center gap-2">
                <Badge className={priorityColors.MEDIUM} variant="secondary">
                  {priorityLabels.MEDIUM}
                </Badge>
              </SelectItem>
              <SelectItem value="HIGH" className="flex items-center gap-2">
                <Badge className={priorityColors.HIGH} variant="secondary">
                  {priorityLabels.HIGH}
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={watchedStatus}
            onValueChange={(value: string) => setValue('status', value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING" className="flex items-center gap-2">
                <Badge className={statusColors.PENDING} variant="secondary">
                  {statusLabels.PENDING}
                </Badge>
              </SelectItem>
              <SelectItem value="IN_PROGRESS" className="flex items-center gap-2">
                <Badge className={statusColors.IN_PROGRESS} variant="secondary">
                  {statusLabels.IN_PROGRESS}
                </Badge>
              </SelectItem>
              <SelectItem value="COMPLETED" className="flex items-center gap-2">
                <Badge className={statusColors.COMPLETED} variant="secondary">
                  {statusLabels.COMPLETED}
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 