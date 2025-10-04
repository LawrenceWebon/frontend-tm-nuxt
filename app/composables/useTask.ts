import { useTaskStore } from '../../stores/task'
import type { Task } from '../../stores/task'

export const useTask = () => {
  const taskStore = useTaskStore()

  return {
    // State
    tasks: computed(() => taskStore.tasks),
    currentDate: computed(() => taskStore.currentDate),
    loading: computed(() => taskStore.loading),
    error: computed(() => taskStore.error),
    
    // Search state
    searchQuery: computed(() => taskStore.searchQuery),
    isSearching: computed(() => taskStore.isSearching),
    searchResults: computed(() => taskStore.searchResults),
    
    // Sorting state
    sortBy: computed(() => taskStore.sortBy),
    
    // Getters
    tasksForCurrentDate: computed(() => taskStore.tasksForCurrentDate),
    filteredTasks: computed(() => taskStore.filteredTasks),
    
    // Actions
    fetchTasks: taskStore.fetchTasks,
    createTask: taskStore.createTask,
    updateTask: taskStore.updateTask,
    deleteTask: taskStore.deleteTask,
    setCurrentDate: taskStore.setCurrentDate,
    
    // Search actions
    searchTasks: taskStore.searchTasks,
    clearSearch: taskStore.clearSearch,
    
    // Sorting actions
    setSortBy: taskStore.setSortBy,
    updateTaskPriority: taskStore.updateTaskPriority,
    reorderTasks: taskStore.reorderTasks,
  }
}

