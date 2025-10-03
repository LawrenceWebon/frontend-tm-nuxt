// @ts-nocheck
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

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
      if (state.searchQuery && state.isSearching) {
        return state.searchResults
      }
      const currentDateTasks = state.tasksForCurrentDate
      return currentDateTasks
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
      this.loading = true
      this.error = null
      
      try {
        const { del } = useApi()
        await del(`/tasks/${taskId}`)
        
        this.tasks = this.tasks.filter((t: Task) => t.id !== taskId)
      } catch (error: any) {
        this.error = error.message || 'Failed to delete task'
        console.error('Failed to delete task:', error)
        throw error
      } finally {
        this.loading = false
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
  },
})
