<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-sm flex items-center justify-center">
          <img src="../assets/images/logo.png" alt="Logo">
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Auto-logout Warning -->
      <div v-if="showLogoutWarning" class="mr-4 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        Auto-logout in {{ minutesUntilLogout }} min
      </div>

      <!-- Refresh Button -->
      <!-- <button
        @click="refreshTasks"
        :disabled="isLoading"
        class="mr-4 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        title="Refresh tasks"
      >
        <svg class="w-4 h-4 mr-1" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button> -->

      <!-- User Avatar with Dropdown -->
      <div class="relative">
        <button
          @click="toggleProfileDropdown"
          class="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showProfileDropdown"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">{{ user?.name || 'User' }}</p>
            <p class="text-xs text-gray-500">{{ user?.email || 'user@example.com' }}</p>
          </div>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white min-h-screen">
        <nav class="p-4">
          <div class="space-y-1">
            <!-- Today (Active) -->
            <div class="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium">
              Today
            </div>
            
            <!-- Yesterday -->
            <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
              Yesterday
            </div>
            
            <!-- Sunday, July 27 -->
            <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
              Sunday, July 27
            </div>
            
            <!-- Last week section -->
            <div class="pt-4">
              <div class="text-gray-400 text-xs font-medium px-3 py-1 uppercase tracking-wide">
                Last week
              </div>
              <div class="space-y-1 mt-2">
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Saturday, July 26
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Friday, July 25
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Thursday, July 24
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Wednesday, July 23
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Tuesday, July 22
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Monday, July 21
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Sunday, July 20
                </div>
              </div>
            </div>
            
            <!-- 3rd Week of July section -->
            <div class="pt-4">
              <div class="text-gray-400 text-xs font-medium px-3 py-1 uppercase tracking-wide">
                3rd Week of July
              </div>
              <div class="space-y-1 mt-2">
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Saturday, July 19
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Friday, July 18
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Thursday, July 17
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Wednesday, July 16
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Tuesday, July 15
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Monday, July 14
                </div>
                <div class="text-gray-700 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
                  Sunday, July 13
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Empty State (shown when no tasks) -->
        <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center min-h-96">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">What do you have in mind?</h2>
          <div class="w-full max-w-2xl">
            <div class="relative">
              <input
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                placeholder="Write the task you plan to do today here..."
                class="w-full px-4 py-4 pr-16 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              />
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Task List (shown when tasks exist) -->
        <div v-else class="flex flex-col" style="height: 85vh;">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p class="text-gray-600">Loading tasks...</p>
            </div>
          </div>
          
          <!-- Task Items Container -->
          <div v-else class="flex-1 overflow-y-auto space-y-3" style="width: 80%; margin: 0 auto;">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <!-- Checkbox -->
              <button
                @click="toggleTask(task.id)"
                class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4 hover:border-gray-400 transition-colors"
                :class="{ 'bg-black border-black': task.status === 'completed' }"
              >
                <svg
                  v-if="task.status === 'completed'"
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Task Text -->
              <div class="flex-1">
                <p
                  class="text-gray-900"
                  :class="{ 'line-through text-gray-500': task.status === 'completed' }"
                >
                  {{ task.title }}
                </p>
                <p v-if="task.priority" class="text-xs text-gray-500 mt-1">
                  Priority: {{ task.priority }}
                </p>
              </div>

              <!-- Delete Button -->
              <button
                @click="confirmDelete(task)"
                class="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Add New Task Input (fixed at bottom) -->
          <div class="p-6 bg-white" style="width: 80%; margin: 0 auto;">
            <div class="relative">
              <input
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                placeholder="What else do you need to do?"
                class="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              />
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Task</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "<span class="font-medium">{{ taskToDelete?.title }}</span>"? This action cannot be undone.
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
            @click="deleteTask($event)"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <div v-if="isDeleting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

// Authentication
const { isAuthenticated, checkAuth, user, logout } = useAuth()
const router = useRouter()

// Auto-logout functionality
const { startAutoLogout, stopAutoLogout, getMinutesUntilLogout } = useAutoLogout()
const authStore = useAuthStore()

// Auto-logout countdown
const minutesUntilLogout = ref(10)
const showLogoutWarning = ref(false)

// Update countdown every minute
const updateCountdown = () => {
  if (isAuthenticated.value) {
    const minutes = authStore.getMinutesUntilLogout()
    minutesUntilLogout.value = minutes
    
    // Show warning when 1 minute or less
    showLogoutWarning.value = minutes <= 1 && minutes > 0
  }
}

// Activity detection
const handleActivity = () => {
  if (isAuthenticated.value) {
    authStore.updateActivity()
    updateCountdown()
  }
}

// API
const { get, post, put, del } = useApi()

// Task management
const tasks = ref([])
const newTask = ref('')
const isLoading = ref(false)

// Delete confirmation modal
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const isDeleting = ref(false)
const deleteOperationId = ref(null)

// Profile dropdown
const showProfileDropdown = ref(false)

// Profile dropdown actions
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const handleLogout = async () => {
  try {
    await logout()
    showProfileDropdown.value = false
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    showProfileDropdown.value = false
  }
}

// Handle keyboard events
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showDeleteModal.value) {
    cancelDelete()
  }
}

// Task actions
const fetchTasks = async () => {
  try {
    isLoading.value = true
    const response = await get('/tasks')
    tasks.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    // Show error message to user
    alert('Failed to load tasks. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Refresh tasks to ensure data synchronization
const refreshTasks = async () => {
  await fetchTasks()
}

const addTask = async () => {
  if (!newTask.value.trim()) return
  
  try {
    isLoading.value = true
    const response = await post('/tasks', {
      title: newTask.value.trim(),
      status: 'pending',
      priority: 'medium',
      date: new Date().toISOString().split('T')[0]
    })
    
    // Add the new task to the list
    tasks.value.unshift(response.data)
    newTask.value = ''
  } catch (error) {
    console.error('Failed to create task:', error)
    alert('Failed to create task. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const toggleTask = async (taskId) => {
  try {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    
    const response = await put(`/tasks/${taskId}`, {
      ...task,
      status: newStatus
    })
    
    // Update the task in the list
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = response.data
    }
  } catch (error) {
    console.error('Failed to update task:', error)
    alert('Failed to update task. Please try again.')
  }
}

const confirmDelete = (task) => {
  taskToDelete.value = task
  deleteOperationId.value = Date.now() // Generate unique operation ID
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  taskToDelete.value = null
  deleteOperationId.value = null
}

const deleteTask = async (event) => {
  // Prevent default behavior and stop propagation
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  if (!taskToDelete.value || isDeleting.value) {
    return
  }
  
  // Check if this is a duplicate operation
  const currentOperationId = deleteOperationId.value
  if (!currentOperationId) {
    return
  }
  
  
  try {
    isDeleting.value = true
    // Clear the operation ID to prevent duplicates
    deleteOperationId.value = null
    
    await del(`/tasks/${taskToDelete.value.id}`)
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Failed to delete task:', error)
    
    // Handle 404 - task not found (already deleted or doesn't exist)
    if (error.status === 404) {
      tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value.id)
      showDeleteModal.value = false
      taskToDelete.value = null
    } else {
      alert('Failed to delete task. Please try again.')
    }
  } finally {
    isDeleting.value = false
  }
}

// Initialize with API data
onMounted(async () => {
  // Check authentication
  checkAuth()
  
  // Load tasks from API
  await fetchTasks()
  
  // Add event listeners
  document.addEventListener('click', closeDropdown)
  document.addEventListener('keydown', handleKeydown)
  
  // Start auto-logout system
  if (isAuthenticated.value) {
    startAutoLogout()
    updateCountdown()
    
    // Set up activity detection
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown']
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })
    
    // Update countdown every minute
    const countdownInterval = setInterval(updateCountdown, 60000)
    
    // Store interval ID for cleanup
    window.countdownInterval = countdownInterval
  }
})

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('click', closeDropdown)
  document.removeEventListener('keydown', handleKeydown)
  
  // Stop auto-logout system
  stopAutoLogout()
  
  // Clear countdown interval
  if (window.countdownInterval) {
    clearInterval(window.countdownInterval)
  }
  
  // Remove activity detection
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown']
  activityEvents.forEach(event => {
    document.removeEventListener(event, handleActivity, true)
  })
})

// Page meta
definePageMeta({
  middleware: 'auth'
})
</script>
