<template>
  <div class="h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-sm flex items-center justify-center">
          <img :src="logoUrl" alt="Logo">
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-8">
        <SearchBar />
      </div>

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

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-white flex flex-col">
        <nav class="p-4 overflow-y-auto flex-1 scrollbar-hide" @scroll="handleSidebarScroll">
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
              <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">
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
              <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">
                {{ getWeekNumber(weekBeforeLastDays[0].date) }} Week of {{ new Date(weekBeforeLastDays[0].date).toLocaleString('default', { month: 'long' }) }}
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

            <!-- Additional weeks sections -->
            <div 
              v-for="(week, weekIndex) in additionalWeeks" 
              :key="`week-${weekIndex}`"
              class="pt-4"
            >
              <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">
                {{ week.weekNumber }} Week of {{ week.monthName }}
              </div>
              <div class="space-y-1 mt-2">
                <div 
                  v-for="(day, dayIndex) in week.days" 
                  :key="`${weekIndex}-${dayIndex}`"
                  @click="selectDateFilter('specific', day.date)"
                  class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  :class="selectedDateFilter === 'specific' && selectedSpecificDate === day.date ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'"
                >
                  {{ day.display }}
                </div>
              </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoadingMoreWeeks" class="pt-4">
              <div class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                <span class="ml-2 text-sm text-gray-500">Loading more dates...</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Search Results Info -->
        <div v-if="isSearching && searchQuery" class="mb-4 flex justify-between items-center px-6 pt-6 flex-shrink-0">
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
        <div v-if="!isSearching && filteredTasks.length > 1" class="mt-4 mb-4 px-6 flex-shrink-0">
          <SortControls />
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto px-6 scrollbar-hide">
          <!-- Empty State (shown when no tasks) -->
          <div v-if="!isSearching && tasks.length === 0" class="flex flex-col items-center justify-center min-h-96">
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
                    <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </button>
                </div>
              </div>
          </div>

          <!-- Task List (shown when tasks exist) -->
          <div v-else class="flex flex-col h-full">
            <!-- Loading State -->
            <div v-if="isLoading" class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 mx-auto mb-4"></div>
                <p class="text-gray-600">Loading tasks...</p>
              </div>
            </div>
            
            <!-- Task Items Container -->
            <div v-else-if="filteredTasks.length > 0" class="space-y-3 overflow-y-auto h-full scrollbar-hide" style="width: 80%; margin: 20px auto 0 auto;">
              <DraggableTaskList @delete-task="confirmDelete" />
            </div>

            <!-- No tasks for today message, you the template "What do you have in mind?" -->
            <div v-else-if="!isSearching && tasks.length > 0 && filteredTasks.length === 0 && selectedDateFilter === 'today'" class="flex flex-col items-center justify-center min-h-96">
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
                    <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </button>
                </div>
              </div>
            </div>

            <!-- No tasks for selected date message -->
            <div v-else-if="!isSearching && tasks.length > 0 && filteredTasks.length === 0" class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide">
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
            <div v-else-if="isSearching" class="h-full flex items-center justify-center overflow-y-auto scrollbar-hide">
              <div class="text-center">
                <p class="text-gray-500">No tasks match your search</p>
              </div>
            </div>

            <!-- Hide this input when selectedDateFilter is 'today' -->
            <div v-if="selectedDateFilter !== 'today' || filteredTasks.length > 0" class="block">
              <!-- Add New Task Input (fixed at bottom) -->
              <div class="pt-6 pb-6 bg-white" style="width: 80%; margin: 0 auto;">
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
                    <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </button>
                </div>
              </div>
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
            @click.stop.prevent="handleDeleteTask"
            :disabled="isDeleting || deleteInProgress"
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useAuth } from '../features/auth/composables/useAuth'
import { useTask } from '../features/tasks/composables/useTask'
import logoImage from '../../assets/images/logo.svg'
import { useTaskStore } from '../features/tasks/stores/task'
import { useAuthStore } from '../features/auth/stores/auth'
import { useRouter } from 'vue-router'
import SearchBar from '../features/tasks/components/ui/SearchBar.vue'
import SortControls from '../features/tasks/components/ui/SortControls.vue'
import DraggableTaskList from '../features/tasks/components/business/DraggableTaskList.vue'

// Authentication
const { isAuthenticated, checkAuth, user, logout } = useAuth()
const router = useRouter()

// Logo URL
const logoUrl = computed(() => logoImage)

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

// Infinite scrolling state
const additionalWeeks = ref([])
const isLoadingMoreWeeks = ref(false)
const currentWeekOffset = ref(15) // Start from 15 days ago (after week before last which is 8-14 days)
const hasMoreWeeks = ref(true)


// Auth store
const authStore = useAuthStore()


// Task management
const newTask = ref('')

// Refresh tasks function
const refreshTasks = async () => {
  try {
    await fetchTasks()
  } catch (error) {
    console.error('Failed to refresh tasks:', error)
  }
}

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
  
  // Get last week (1 day ago to 7 days ago) - most recent first
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    
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
  
  // Get week before last (8 days ago to 14 days ago) - most recent first
  for (let i = 8; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    
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
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  return `${dayName}, ${monthDay}`
}

const getWeekNumber = (dateString) => {
  const date = new Date(dateString)
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  
  // Calculate which week of the month this date falls into
  // Week 1: 1st-7th, Week 2: 8th-14th, Week 3: 15th-21st, Week 4: 22nd-28th, Week 5: 29th+
  const dayOfMonth = date.getDate()
  const weekNumber = Math.ceil(dayOfMonth / 7)
  
  // Add ordinal suffix (1st, 2nd, 3rd, 4th, 5th, etc.)
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = weekNumber % 100
  return weekNumber + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

// Generate days for a specific week (7 days starting from weekOffset)
const generateWeekDays = (weekOffset) => {
  const days = []
  const today = new Date()
  
  // Generate 7 days starting from weekOffset days ago
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (weekOffset + i))
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    
    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }
  
  return days
}

// Load more weeks
const loadMoreWeeks = async () => {
  if (isLoadingMoreWeeks.value || !hasMoreWeeks.value) return
  
  isLoadingMoreWeeks.value = true
  
  try {
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const weekDays = generateWeekDays(currentWeekOffset.value)
    const firstDayDate = new Date(weekDays[0].date)
    const monthName = firstDayDate.toLocaleString('default', { month: 'long' })
    const weekNumber = getWeekNumber(weekDays[0].date)
    
    const newWeek = {
      weekOffset: currentWeekOffset.value,
      monthName: monthName,
      weekNumber: weekNumber,
      days: weekDays
    }
    
    additionalWeeks.value.push(newWeek)
    currentWeekOffset.value += 7 // Move to next week
    
    // Limit to 52 weeks back (1 year)
    if (currentWeekOffset.value > 365) {
      hasMoreWeeks.value = false
    }
  } catch (error) {
    console.error('Error loading more weeks:', error)
  } finally {
    isLoadingMoreWeeks.value = false
  }
}

// Handle scroll events for infinite loading
const handleSidebarScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  
  // Load more when user scrolls to within 100px of the bottom
  if (scrollHeight - scrollTop - clientHeight < 100 && hasMoreWeeks.value && !isLoadingMoreWeeks.value) {
    loadMoreWeeks()
  }
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
const deleteInProgress = ref(false) // Additional guard against double deletion

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
// Watch for changes in selectedDateFilter
watch(selectedDateFilter, (newValue, oldValue) => {
}, { immediate: true }) 

// Delete task with confirmation modal
const confirmDelete = (task) => {
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
      alert(`Failed to delete task: ${error.message || 'Unknown error'}`)
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
  document.addEventListener('click', closeDropdown)
  document.addEventListener('keydown', handleKeydown)
  
  
  // Set up periodic token expiration check
  if (isAuthenticated.value) {
    // Check token expiration every 5 minutes
    const tokenCheckInterval = setInterval(() => {
      if (isAuthenticated.value) {
        authStore.checkTokenExpiration()
      } else {
        clearInterval(tokenCheckInterval)
      }
    }, 5 * 60 * 1000) // 5 minutes
    
    // Store interval ID for cleanup
    window.tokenCheckInterval = tokenCheckInterval
  }
})

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('click', closeDropdown)
  document.removeEventListener('keydown', handleKeydown)
  
  
  // Clear token check interval
  if (window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval)
  }
})

// Page meta
definePageMeta({
  middleware: 'auth'
})
</script>
