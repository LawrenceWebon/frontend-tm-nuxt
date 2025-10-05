<template>
  <main id="main-content" class="flex flex-col h-full" role="main" aria-label="Task management">
    <!-- Search Results Info -->
    <div
      v-if="isSearching && searchQuery"
      class="mb-4 flex justify-between items-center px-6 pt-6 flex-shrink-0"
      role="status"
      aria-live="polite"
    >
      <p class="text-sm text-gray-500">
        <span v-if="filteredTasks.length > 0">
          Found {{ filteredTasks.length }} results for "{{ searchQuery }}"
        </span>
        <span v-else>No results found for "{{ searchQuery }}"</span>
      </p>
      <button
        @click="clearSearch"
        @keydown.enter="clearSearch"
        @keydown.space.prevent="clearSearch"
        type="button"
        aria-label="Clear search results"
        class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 rounded"
      >
        <!-- <span>Clear search</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg> -->
      </button>
    </div>

    <!-- Sort Controls -->
    <div v-if="!isSearching && filteredTasks.length > 1" class="mt-4 mb-4 px-6 flex-shrink-0">
      <SortControls />
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-y-auto px-6 scrollbar-hide">
      <!-- Empty State (shown when no tasks) -->
      <div
        v-if="!isSearching && tasks.length === 0"
        class="flex flex-col items-center justify-center min-h-96"
        role="region"
        aria-label="Add new task"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">What do you have in mind?</h2>
        <div class="w-full max-w-2xl">
          <div class="relative">
            <label for="new-task-input" class="sr-only">Add new task</label>
            <textarea
              id="new-task-input"
              v-model="newTask"
              @keyup.enter="addTask"
              :placeholder="`Write the task you plan to do ${getPlaceholderText()} here...`"
              aria-label="New task description"
              class="w-full px-4 py-4 pr-16 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 resize-none"
              rows="4"
            ></textarea>
            <button
              @click="addTask"
              @keydown.enter="addTask"
              @keydown.space.prevent="addTask"
              :disabled="!newTask.trim() || isLoading"
              type="button"
              :aria-label="isLoading ? 'Adding task...' : 'Add new task'"
              class="absolute bottom-4 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
            >
              <svg
                v-if="!isLoading"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <div
                v-else
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                aria-hidden="true"
              ></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Task List (shown when tasks exist) -->
      <div v-else class="flex flex-col h-full">
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 mx-auto mb-4"
            ></div>
            <p class="text-gray-600">Loading tasks...</p>
          </div>
        </div>

        <!-- Task Items Container -->
        <div
          v-else-if="filteredTasks.length > 0"
          class="space-y-3 overflow-y-auto h-full scrollbar-hide"
          style="width: 80%; margin: 20px auto 0 auto"
          role="list"
          aria-label="Task list"
        >
          <DraggableTaskList @delete-task="confirmDelete" />
        </div>

        <!-- No tasks for today message, you the template "What do you have in mind?" -->
        <div
          v-else-if="
            !isSearching &&
            tasks.length > 0 &&
            filteredTasks.length === 0 &&
            selectedDateFilter === 'today'
          "
          class="flex flex-col items-center justify-center min-h-96"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">What do you have in mind?</h2>
          <div class="w-full max-w-2xl">
            <div class="relative">
              <textarea
                v-model="newTask"
                @keyup.enter="addTask"
                :placeholder="`Write the task you plan to do ${getPlaceholderText()} here...`"
                class="w-full px-4 py-4 pr-16 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent resize-none"
                rows="4"
              ></textarea>
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute bottom-4 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!isLoading"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- No tasks for selected date message -->
        <div
          v-else-if="!isSearching && tasks.length > 0 && filteredTasks.length === 0"
          class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide"
        >
          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks for this date</h3>
            <p class="text-gray-500 mb-4">
              <span v-if="selectedDateFilter === 'today'">You don't have any tasks for today.</span>
              <span v-else-if="selectedDateFilter === 'yesterday'">
                You don't have any tasks for yesterday.
              </span>
              <span v-else-if="selectedDateFilter === 'dayBeforeYesterday'">
                You don't have any tasks for {{ formatDateForDisplay(dayBeforeYesterday) }}.
              </span>
              <span v-else-if="selectedDateFilter === 'specific'">
                You don't have any tasks for {{ formatDateForDisplay(selectedSpecificDate) }}.
              </span>
              <span v-else>You don't have any tasks for the selected date.</span>
            </p>
            <button
              @click="selectDateFilter('today')"
              class="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              View Today's Tasks
            </button>
          </div>
        </div>

        <!-- No search results message -->
        <div
          v-else-if="isSearching"
          class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide"
        >
          <div class="text-center">
            <p class="text-gray-500">No tasks match your search</p>
          </div>
        </div>

        <!-- Hide this input when selectedDateFilter is 'today' -->
        <div v-if="selectedDateFilter !== 'today' || filteredTasks.length > 0" class="block">
          <!-- Add New Task Input (fixed at bottom) -->
          <div class="pt-6 pb-6 bg-white" style="width: 80%; margin: 0 auto">
            <div class="relative">
              <input
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                :placeholder="`What else do you need to do ${getPlaceholderText()}?`"
                class="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-sm"
              />
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!isLoading"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Task</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "
          <span class="font-medium">{{ taskToDelete?.title }}</span>
          "? This action cannot be undone.
        </p>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click.stop.prevent="handleDeleteTask"
            :disabled="isDeleting || deleteInProgress"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <div
              v-if="isDeleting"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '../features/auth/composables/useAuth'
import { useTask } from '../features/tasks/composables/useTask'
import { useTaskStore } from '../features/tasks/stores/task'
import { useAuthStore } from '../features/auth/stores/auth'
import { useNotification } from '../shared/composables/useNotification'
import { useDateFilter } from '../shared/composables/useDateFilter'
import SortControls from '../features/tasks/components/ui/SortControls.vue'
import DraggableTaskList from '../features/tasks/components/business/DraggableTaskList.vue'

// Authentication
const { isAuthenticated, checkAuth } = useAuth()

// Notifications
const { error: showError, success: showSuccess } = useNotification()

// Task management
const {
  tasks,
  filteredTasks,
  isSearching,
  searchQuery,
  loading: isLoading,
  fetchTasks,
  createTask,
  deleteTask,
  clearSearch,
  setCurrentDate
} = useTask()

// Date filtering state - now shared with sidebar
const { selectedDateFilter, selectedSpecificDate, formatDateForDisplay, getPlaceholderText } =
  useDateFilter()

// Auth store
const authStore = useAuthStore()

// Task management
const newTask = ref('')

// Refresh tasks function
const _refreshTasks = async () => {
  try {
    await fetchTasks()
  } catch (error) {
    console.error('Failed to refresh tasks:', error)
  }
}

// Helper function to format dates
const _formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Date filtering computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const yesterday = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
})

const dayBeforeYesterday = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - 2)
  return date.toISOString().split('T')[0]
})

// Date filtering methods are now handled by the shared useDateFilter composable

// getPlaceholderText is now imported from useDateFilter

// Delete confirmation modal
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const isDeleting = ref(false)
const deleteInProgress = ref(false) // Additional guard against double deletion

// Handle keyboard events
const handleKeydown = event => {
  if (event.key === 'Escape' && showDeleteModal.value) {
    cancelDelete()
  }
}

// Task actions
const addTask = async () => {
  if (!newTask.value.trim()) return

  try {
    // Get the currently selected date instead of always using today
    let targetDate = ''

    switch (selectedDateFilter.value) {
      case 'today':
        targetDate = today.value
        break
      case 'yesterday':
        targetDate = yesterday.value
        break
      case 'dayBeforeYesterday':
        targetDate = dayBeforeYesterday.value
        break
      case 'specific':
        targetDate = selectedSpecificDate.value
        break
      default:
        targetDate = today.value
    }

    await createTask({
      title: newTask.value.trim(),
      status: 'pending',
      priority: 'medium',
      date: targetDate
    })
    newTask.value = ''
    showSuccess('Task created successfully!')
  } catch (error) {
    console.error('Failed to create task:', error)
    showError('Failed to create task. Please try again.')
  }
}
// selectedDateFilter watcher removed - now handled by shared useDateFilter composable

// Delete task with confirmation modal
const confirmDelete = task => {
  if (isDeleting.value) return // Prevent multiple clicks

  taskToDelete.value = task
  showDeleteModal.value = true
}

const cancelDelete = () => {
  if (isDeleting.value) return // Prevent closing during deletion

  showDeleteModal.value = false
  taskToDelete.value = null
}

const handleDeleteTask = async () => {
  // Prevent multiple deletions with multiple guards
  if (isDeleting.value || deleteInProgress.value || !taskToDelete.value) {
    return
  }

  try {
    isDeleting.value = true
    deleteInProgress.value = true

    const taskIdToDelete = taskToDelete.value.id

    // Verify task still exists in local state
    const taskExists = tasks.value.some(t => t.id === taskIdToDelete)
    if (!taskExists) {
      showDeleteModal.value = false
      taskToDelete.value = null
      isDeleting.value = false
      deleteInProgress.value = false
      return
    }

    // Perform the deletion
    await deleteTask(taskIdToDelete)

    // Show success message
    showSuccess('Task deleted successfully!')

    // Close modal and reset state
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    // If task not found on backend, remove it from local state and close modal
    if (error.status === 404) {
      // Remove from local state since it doesn't exist on backend
      const taskIdToDelete = taskToDelete.value.id
      const taskStore = useTaskStore()
      taskStore.tasks = taskStore.tasks.filter(t => t.id !== taskIdToDelete)

      // Close modal without showing error
      showDeleteModal.value = false
      taskToDelete.value = null
    } else {
      // Show error for other types of failures
      console.error('Failed to delete task:', error)
      showError(`Failed to delete task: ${error.message || 'Unknown error'}`)
    }
  } finally {
    isDeleting.value = false
    deleteInProgress.value = false
  }
}

// Initialize with API data
onMounted(async () => {
  // Check authentication
  checkAuth()

  // Initialize date filter to today
  setCurrentDate(today.value)

  // Load tasks from API
  await fetchTasks()

  // Add event listeners
  document.addEventListener('keydown', handleKeydown)

  // Set up periodic token expiration check
  if (isAuthenticated.value) {
    // Check token expiration every 5 minutes
    const tokenCheckInterval = setInterval(
      () => {
        if (isAuthenticated.value) {
          authStore.checkTokenExpiration()
        } else {
          clearInterval(tokenCheckInterval)
        }
      },
      5 * 60 * 1000
    ) // 5 minutes

    // Store interval ID for cleanup
    window.tokenCheckInterval = tokenCheckInterval
  }
})

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('keydown', handleKeydown)

  // Clear token check interval
  if (window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval)
  }
})

// Page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})
</script>
