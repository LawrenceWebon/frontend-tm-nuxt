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
        <SearchBar />
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
            <div 
              @click="selectDateFilter('today')"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="selectedDateFilter === 'today' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
            >
              Today
            </div>
            
            <!-- Yesterday -->
            <div 
              @click="selectDateFilter('yesterday')"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="selectedDateFilter === 'yesterday' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
            >
              Yesterday
            </div>
            
            <!-- Day before yesterday -->
            <div 
              @click="selectDateFilter('dayBeforeYesterday')"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="selectedDateFilter === 'dayBeforeYesterday' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
            >
              {{ formatDateForDisplay(dayBeforeYesterday) }}
            </div>
            
            <!-- Last week section -->
            <div class="pt-4">
              <div class="text-gray-400 text-xs font-medium px-3 py-1 uppercase tracking-wide">
                Last week
              </div>
              <div class="space-y-1 mt-2">
                <div 
                  v-for="(day, index) in lastWeekDays" 
                  :key="index"
                  @click="selectDateFilter('specific', day.date)"
                  class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  :class="selectedDateFilter === 'specific' && selectedSpecificDate === day.date ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
                >
                  {{ day.display }}
                </div>
              </div>
            </div>
            
            <!-- Week before last section -->
            <div class="pt-4">
              <div class="text-gray-400 text-xs font-medium px-3 py-1 uppercase tracking-wide">
                Week before last
              </div>
              <div class="space-y-1 mt-2">
                <div 
                  v-for="(day, index) in weekBeforeLastDays" 
                  :key="index"
                  @click="selectDateFilter('specific', day.date)"
                  class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  :class="selectedDateFilter === 'specific' && selectedSpecificDate === day.date ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
                >
                  {{ day.display }}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Search Results Info -->
        <div v-if="isSearching && searchQuery" class="mb-4 flex justify-between items-center">
          <p class="text-sm text-gray-500">
            <span v-if="filteredTasks.length > 0">Found {{ filteredTasks.length }} results for "{{ searchQuery }}"</span>
            <span v-else>No results found for "{{ searchQuery }}"</span>
          </p>
          <button 
            @click="clearSearch" 
            class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <!-- <span>Clear search</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg> -->
          </button>
        </div>

        <!-- Sort Controls -->
        <div v-if="!isSearching && filteredTasks.length > 0" class="mb-4">
          <SortControls />
        </div>

        <!-- Empty State (shown when no tasks) -->
        <div v-if="!isSearching && tasks.length === 0" class="flex flex-col items-center justify-center min-h-96">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">What do you have in mind?</h2>
          <div class="w-full max-w-2xl">
            <div class="relative">
              <input
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                :placeholder="`Write the task you plan to do ${getPlaceholderText()} here...`"
                class="w-full px-4 py-4 pr-16 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              />
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
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
          <div v-else-if="filteredTasks.length > 0" class="flex-1 overflow-y-auto space-y-3" style="width: 80%; margin: 0 auto;">
            <DraggableTaskList @delete-task="handleDeleteTask" />
          </div>

          <!-- No tasks for selected date message -->
          <div v-else-if="!isSearching && tasks.length > 0 && filteredTasks.length === 0" class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks for this date</h3>
              <p class="text-gray-500 mb-4">
                <span v-if="selectedDateFilter === 'today'">You don't have any tasks for today.</span>
                <span v-else-if="selectedDateFilter === 'yesterday'">You don't have any tasks for yesterday.</span>
                <span v-else-if="selectedDateFilter === 'dayBeforeYesterday'">You don't have any tasks for {{ formatDateForDisplay(dayBeforeYesterday) }}.</span>
                <span v-else-if="selectedDateFilter === 'specific'">You don't have any tasks for {{ formatDateForDisplay(selectedSpecificDate) }}.</span>
                <span v-else>You don't have any tasks for the selected date.</span>
              </p>
              <button 
                @click="selectDateFilter('today')"
                class="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                View Today's Tasks
              </button>
            </div>
          </div>

          <!-- No search results message -->
          <div v-else-if="isSearching" class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <p class="text-gray-500">No tasks match your search</p>
            </div>
          </div>

          <!-- Add New Task Input (fixed at bottom) -->
          <div class="p-6 bg-white" style="width: 80%; margin: 0 auto;">
            <div class="relative">
              <input
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                :placeholder="`What else do you need to do ${getPlaceholderText()}?`"
                class="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              />
              <button
                @click="addTask"
                :disabled="!newTask.trim() || isLoading"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
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
            @click="handleDeleteTask($event)"
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
import { useTask } from '~/composables/useTask'
import { useRouter } from 'vue-router'

// Authentication
const { isAuthenticated, checkAuth, user, logout } = useAuth()
const router = useRouter()

// Task management
const { 
  tasks, 
  filteredTasks, 
  isSearching, 
  searchQuery, 
  loading: isLoading, 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  clearSearch,
  setCurrentDate,
  updateTaskPriority,
  sortBy
} = useTask()

// Date filtering state
const selectedDateFilter = ref('today')
const selectedSpecificDate = ref('')


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

// Task management
const newTask = ref('')

// Helper function to format dates
const formatDate = (dateString) => {
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

const lastWeekDays = computed(() => {
  const days = []
  const today = new Date()
  
  // Get last week (7 days ago to 1 day ago)
  for (let i = 7; i >= 1; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }
  
  return days
})

const weekBeforeLastDays = computed(() => {
  const days = []
  const today = new Date()
  
  // Get week before last (14 days ago to 8 days ago)
  for (let i = 14; i >= 8; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }
  
  return days
})

// Date filtering methods
const selectDateFilter = (filterType, specificDate = null) => {
  selectedDateFilter.value = filterType
  selectedSpecificDate.value = specificDate || ''
  
  // Clear search when changing date filter
  clearSearch()
  
  let targetDate = ''
  
  switch (filterType) {
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
      targetDate = specificDate
      break
    default:
      targetDate = today.value
  }
  
  setCurrentDate(targetDate)
}

const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${dayName}, ${monthDay}`
}

const getPlaceholderText = () => {
  switch (selectedDateFilter.value) {
    case 'today':
      return 'today'
    case 'yesterday':
      return 'yesterday'
    case 'dayBeforeYesterday':
      return `on ${formatDateForDisplay(dayBeforeYesterday.value)}`
    case 'specific':
      return `on ${formatDateForDisplay(selectedSpecificDate.value)}`
    default:
      return 'today'
  }
}

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
  } catch (error) {
    console.error('Failed to create task:', error)
    alert('Failed to create task. Please try again.')
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

const handleDeleteTask = async (event) => {
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
    
    // Store the task ID before deletion
    const taskIdToDelete = taskToDelete.value.id
    
    // Verify task exists in local state
    const taskExists = tasks.value.some(t => t.id === taskIdToDelete)
    if (!taskExists) {
      console.warn(`Task ${taskIdToDelete} not found in local state, skipping deletion`)
      showDeleteModal.value = false
      taskToDelete.value = null
      return
    }
    
    await deleteTask(taskIdToDelete)
    
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Failed to delete task:', error)
      alert(`Failed to delete task: ${error.message || 'Unknown error'}`)
  } finally {
    isDeleting.value = false
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
