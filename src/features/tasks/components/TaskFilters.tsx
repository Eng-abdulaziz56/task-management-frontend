import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import type { GetTasksQueryParams } from '../api/types';

interface TaskFiltersProps {
  filters: GetTasksQueryParams;
  onFiltersChange: (filters: GetTasksQueryParams) => void;
  onClearFilters: () => void;
}

export function TaskFilters({ filters, onFiltersChange, onClearFilters }: TaskFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const filtersRef = useRef(filters);

  // Keep ref updated with latest filters
  useEffect(() => {
    filtersRef.current = filters;
  });

  // Update filters when debounced search value changes
  useEffect(() => {
    onFiltersChange({ ...filtersRef.current, search: debouncedSearchValue || undefined });
  }, [debouncedSearchValue, onFiltersChange]);

  // Update local search value when filters change (e.g., when clearing filters)
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ ...filters, priority: value === 'all' ? undefined : value as 'LOW' | 'MEDIUM' | 'HIGH' });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' });
  };

  const hasActiveFilters = filters.search || filters.priority || filters.status;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 