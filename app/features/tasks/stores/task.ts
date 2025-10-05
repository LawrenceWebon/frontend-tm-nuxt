// @ts-nocheck
import { defineStore } from 'pinia'
import { useApi } from '../../../shared/composables/useApi'

export interface Task {
  id: number
  title: string
  status: 'pending' | 'completed'
  priority: 'low' | 'medium' | 'high'
  date: string
  order: number
  created_at?: string
  updated_at?: string
}

// Track tasks currently being deleted to prevent duplicates
const deletingTaskIds = new Set<number>()

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    currentDate: new Date().toISOString().split('T')[0],
    loading: false,
    error: null as string | null,
    // Search-related state
    searchQuery: '',
    searchResults: [] as Task[],
    isSearching: false,
    // Sorting state
    sortBy: 'order' as 'order' | 'priority' | 'title',
  }),

  getters: {
    tasksForCurrentDate: (state: any) => {
      const filtered = state.tasks.filter((task: Task) => {
        // Convert task date to YYYY-MM-DD format for comparison
        const taskDate = new Date(task.date).toISOString().split('T')[0]
        return taskDate === state.currentDate
      })
      return filtered
    },
    
    filteredTasks: (state: any) => {
      let tasks: Task[]
      
      if (state.searchQuery && state.isSearching) {
        tasks = state.searchResults
      } else {
        tasks = state.tasksForCurrentDate
      }

      // Sort tasks based on sortBy
      return [...tasks].sort((a, b) => {
        if (state.sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        } else if (state.sortBy === 'title') {
          return a.title.localeCompare(b.title)
        } else {
          // Default to custom order
          return a.order - b.order
        }
      })
    },
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      
      try {
        const { get } = useApi()
        const response = await get('/tasks')
        this.tasks = response.data || []
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch tasks'
        console.error('Failed to fetch tasks:', error)
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData: Partial<Task>) {
      this.loading = true
      this.error = null
      
      try {
        const { post } = useApi()
        const response = await post('/tasks', taskData)
        
        if (response.data) {
          this.tasks.unshift(response.data)
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to create task'
        console.error('Failed to create task:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(taskId: number, updates: Partial<Task>): Promise<any> {
      this.loading = true
      this.error = null
      
      try {
        const { put } = useApi()
        const response = await put(`/tasks/${taskId}`, updates)
        
        if (response.data) {
          const index = this.tasks.findIndex((t: Task) => t.id === taskId)
          if (index !== -1) {
            this.tasks[index] = response.data
          }
          
          // Also update searchResults if we're in search mode
          if (this.isSearching && this.searchResults.length > 0) {
            const searchIndex = this.searchResults.findIndex((t: Task) => t.id === taskId)
            if (searchIndex !== -1) {
              this.searchResults[searchIndex] = response.data
            }
          }
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to update task'
        console.error('Failed to update task:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTask(taskId: number) {
      // Check if this task is already being deleted
      if (deletingTaskIds.has(taskId)) {
        console.warn('DUPLICATE DELETE PREVENTED! Task', taskId, 'is already being deleted')
        return
      }
      
      // Mark this task as being deleted
      deletingTaskIds.add(taskId)
      
      this.loading = true
      this.error = null
      
      try {
        const { del } = useApi()
        await del(`/tasks/${taskId}`)
        
        this.tasks = this.tasks.filter((t: Task) => t.id !== taskId)
        
        // Also remove from searchResults if we're in search mode
        if (this.isSearching && this.searchResults.length > 0) {
          this.searchResults = this.searchResults.filter((t: Task) => t.id !== taskId)
        }
      } catch (error: any) {
        // Handle different error cases
        if (error.status === 404) {
          console.log('Task not found, removing from local state')
          this.tasks = this.tasks.filter((t: Task) => t.id !== taskId)
          // Also remove from searchResults if we're in search mode
          if (this.isSearching && this.searchResults.length > 0) {
            this.searchResults = this.searchResults.filter((t: Task) => t.id !== taskId)
          }
        } else if (error.status === 200 && error.data?.code === 'TASK_ALREADY_DELETED') {
          console.log('Task already deleted, removing from local state')
          this.tasks = this.tasks.filter((t: Task) => t.id !== taskId)
          // Also remove from searchResults if we're in search mode
          if (this.isSearching && this.searchResults.length > 0) {
            this.searchResults = this.searchResults.filter((t: Task) => t.id !== taskId)
          }
        } else {
          // For other errors, set error state and throw
          this.error = error.message || 'Failed to delete task'
          console.error('Failed to delete task:', error)
          throw error
        }
      } finally {
        this.loading = false
        // Remove from the set after completion (success or failure)
        deletingTaskIds.delete(taskId)
      }
    },

    setCurrentDate(date: string) {
      this.currentDate = date
    },

    // Search functionality
    async searchTasks(query: string): Promise<Task[]> {
      if (!query.trim()) {
        this.searchQuery = ''
        this.searchResults = []
        this.isSearching = false
        return []
      }

      this.searchQuery = query
      this.isSearching = true
      this.loading = true
      this.error = null

      try {
        const { get } = useApi()
        const response = await get(`/tasks?search=${encodeURIComponent(query)}`)
        
        this.searchResults = response.data || []
        return this.searchResults
      } catch (error: any) {
        this.error = error.message || 'Search failed'
        console.error('Search failed:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.isSearching = false
    },

    // Sorting functionality
    setSortBy(sortBy: 'order' | 'priority' | 'title') {
      this.sortBy = sortBy
    },

    async updateTaskPriority(taskId: number, priority: 'high' | 'medium' | 'low') {
      this.error = null
      
      try {
        const { put } = useApi()
        const response = await put(`/tasks/${taskId}`, { priority })
        
        if (response.data) {
          // Update task in local state - use reactive update
          const index = this.tasks.findIndex((t: Task) => t.id === taskId)
          if (index !== -1) {
            // Update the specific property to maintain reactivity
            this.tasks[index].priority = response.data.priority
            this.tasks[index].updated_at = response.data.updated_at
          }
          
          // Also update searchResults if we're in search mode
          if (this.isSearching && this.searchResults.length > 0) {
            const searchIndex = this.searchResults.findIndex((t: Task) => t.id === taskId)
            if (searchIndex !== -1) {
              this.searchResults[searchIndex].priority = response.data.priority
              this.searchResults[searchIndex].updated_at = response.data.updated_at
            }
          }
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to update task priority'
        console.error('Failed to update task priority:', error)
        return null
      }
    },

    async reorderTasks(tasks: Task[]) {
      // Update local state immediately for responsive UI
      const updatedTasks = tasks.map((task, index) => ({
        ...task,
        order: index
      }))

      // Store original tasks for potential rollback
      const originalTasks = [...this.tasks]

      // Prepare data for API
      const reorderData = updatedTasks.map(task => ({
        id: task.id,
        order: task.order
      }))

      // Send to API
      const { fetchWithAuth } = useApi()

      try {
        const response = await fetchWithAuth('/tasks/reorder', {
          method: 'PUT',
          body: JSON.stringify({ tasks: reorderData })
        })

        if (!response.success) {
          console.error('❌ API error response:', response)
          throw new Error(`Failed to reorder tasks: ${response.status} ${response.message}`)
        }

        // Update local state with the new order instead of fetching from API
        this.tasks = this.tasks.map(task => {
          const updatedTask = updatedTasks.find(t => t.id === task.id)
          return updatedTask || task
        })

        return true
      } catch (error: any) {
        console.error('❌ TaskStore reorderTasks error:', error)
        this.error = error.message
        // Revert local state on error
        this.tasks = originalTasks
        return false
      }
    },
  },
})
