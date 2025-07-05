import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './api/hooks';
import type { Task, CreateTaskRequest, UpdateTaskRequest, GetTasksQueryParams } from './api/types';

export function TasksPage() {
  const [filters, setFilters] = useState<GetTasksQueryParams>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { clearTokens } = useAuthStore();

  const { data: tasksResponse, isLoading, isFetching, error } = useTasks(filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const tasks = tasksResponse?.data || [];

  const handleCreateTask = (data: CreateTaskRequest) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleUpdateTask = (data: UpdateTaskRequest) => {
    if (editingTask) {
      updateTaskMutation.mutate(
        { id: editingTask.id, data },
        {
          onSuccess: () => {
            setEditingTask(null);
          },
        }
      );
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        setDeletingTask(null);
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteDialogOpen(true);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleLogout = () => {
    clearTokens();
    window.location.href = '/auth';
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tasks</h2>
          <p className="text-gray-600">Failed to load tasks. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        key="task-filters"
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Tasks Grid */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters or create a new task.'
                : 'Get started by creating your first task.'}
            </p>
            {Object.keys(filters).length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
        
        {/* Overlay spinner when refetching (but not on initial load) */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Updating...</span>
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader> 
            <DialogTitle>Create New Task</DialogTitle> 
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask} 
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createTaskMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
              isLoading={updateTaskMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open && !deleteTaskMutation.isPending) {
            setIsDeleteDialogOpen(false);
            setDeletingTask(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle> 
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete the task "{deletingTask?.title}"? 
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (!deleteTaskMutation.isPending) {
                  setIsDeleteDialogOpen(false);
                  setDeletingTask(null);
                }
              }}
              disabled={deleteTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingTask && handleDeleteTask(deletingTask.id)}
              disabled={deleteTaskMutation.isPending}
              className="flex items-center gap-2"
            >
              {deleteTaskMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
        size="lg"
      >
        <Plus className="h-15 w-15 text-white" />
      </Button>
    </div>
  );
}  